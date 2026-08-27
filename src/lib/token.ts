import crypto from 'crypto';

function base64urlDecode(input: string) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString();
}

function base64urlEncode(input: Buffer | string) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function verifyToken(token: string, secret?: string) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;

  try {
    const payloadJson = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);

    const key = secret || process.env.VOTER_TOKEN_SECRET || 'dev-secret';
    const expectedSig = crypto.createHmac('sha256', key).update(payloadJson).digest();
    const expectedSigB64 = base64urlEncode(expectedSig);

    // constant-time comparison
    const sigBuf = Buffer.from(sigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const expectedBuf = Buffer.from(expectedSigB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    // check expiration
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now) return null;

    return payload;
  } catch (err) {
    return null;
  }
}

export function signPayload(payload: Record<string, any>, secret?: string) {
  const key = secret || process.env.VOTER_TOKEN_SECRET || 'dev-secret';
  const json = JSON.stringify(payload);
  const sig = crypto.createHmac('sha256', key).update(json).digest();
  return `${base64urlEncode(json)}.${base64urlEncode(sig)}`;
}
