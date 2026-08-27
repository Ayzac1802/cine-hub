import { NextResponse } from 'next/server';
import crypto from 'crypto';

function base64url(input: Buffer | string) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const voterId = body?.voterId || crypto.randomUUID();

    const ttlSeconds = Number(process.env.VOTER_TOKEN_TTL_SECONDS) || 15 * 60; // default 15 minutes
    const exp = Math.floor(Date.now() / 1000) + ttlSeconds;

    const payload = JSON.stringify({ voterId, exp });

    const secret = process.env.VOTER_TOKEN_SECRET || 'dev-secret';
    const sig = crypto.createHmac('sha256', secret).update(payload).digest();

    const token = `${base64url(payload)}.${base64url(sig)}`;

    // Determine site origin from headers or environment fallback
    const originFromHeader = request.headers.get('x-forwarded-proto') && request.headers.get('host')
      ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}`
      : request.headers.get('origin');

    const origin = process.env.NEXT_PUBLIC_BASE_URL || originFromHeader || 'http://localhost:4028';
    // Use a short /t/<token> path for nicer QR links
    const url = `${origin.replace(/\/$/, '')}/t/${token}`;

    return NextResponse.json({ url, expiresAt: exp }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Could not create token' }, { status: 500 });
  }
}
