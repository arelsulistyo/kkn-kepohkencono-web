import { NextResponse, type NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const NO_STORE = { 'Cache-Control': 'no-store' };

/** JSON response that browsers and proxies must not cache (resident data). */
export const noStoreJson = (body: unknown, init: ResponseInit = {}) =>
  NextResponse.json(body, {
    ...init,
    headers: { ...NO_STORE, ...init.headers },
  });

const staffEmails = () =>
  new Set(
    (process.env.STAFF_EMAILS ?? '')
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );

/**
 * Verifies the Firebase ID token in `Authorization: Bearer <token>` and checks
 * the account against the STAFF_EMAILS allowlist. Returns an error response to
 * send back, or null when the caller is staff. An empty allowlist denies everyone.
 */
export async function requireStaff(request: NextRequest): Promise<NextResponse | null> {
  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization') ?? '');
  if (!match) {
    console.warn('requireStaff: request has no Bearer token');
    return noStoreJson({ error: 'Unauthorized' }, { status: 401 });
  }

  let email: string | undefined;
  try {
    const decoded = await adminAuth().verifyIdToken(match[1]);
    email = decoded.email?.toLowerCase();
  } catch (error) {
    // Usually missing/invalid FIREBASE_* admin credentials or a project mismatch.
    console.error('requireStaff: could not verify ID token:', error);
    return noStoreJson({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!email || !staffEmails().has(email)) {
    console.warn(`requireStaff: ${email ?? 'account without email'} is not in STAFF_EMAILS`);
    return noStoreJson({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
