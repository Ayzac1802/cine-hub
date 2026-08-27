import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/token';

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const token = params?.token;
  const valid = token ? verifyToken(token) : null;
  if (!valid) {
    // redirect to voter screen with an error flag so the UI can show an expired message
    const origin = request.headers.get('origin') || (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4028');
    const dest = `${origin.replace(/\/$/, '')}/voter-screen?token_invalid=1`;
    return NextResponse.redirect(dest, 307);
  }

  const origin = request.headers.get('origin') || (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4028');
  const dest = `${origin.replace(/\/$/, '')}/voter-screen?token=${encodeURIComponent(token as string)}`;
  return NextResponse.redirect(dest, 307);
}
