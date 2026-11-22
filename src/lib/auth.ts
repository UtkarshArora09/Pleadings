import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'pleadings_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

interface SessionPayload {
  v: 1;
  sub: 'admin';
  iat: number;
  exp: number;
  jti: string;
}

// In-memory revocation list for logged-out session IDs (single-instance defense-in-depth;
// rotating ADMIN_SESSION_SECRET in Vercel revokes all sessions across all instances immediately).
const revokedSessionIds = new Map<string, number>();

function pruneRevokedSessions(nowSec: number) {
  for (const [jti, exp] of revokedSessionIds.entries()) {
    if (exp <= nowSec) revokedSessionIds.delete(jti);
  }
}

function getSessionSecret(): string | null {
  const explicit = (process.env.ADMIN_SESSION_SECRET || '').trim().replace(/^["']|["']$/g, '');
  if (explicit.length >= 16) return explicit;

  // Derive a deterministic signing key from the configured env credential if ADMIN_SESSION_SECRET
  // has not yet been provisioned separately. Never falls back to a hardcoded literal.
  const baseMaterial = (
    process.env.ADMIN_PASSWORD_HASH ||
    process.env.ADMIN_KEY ||
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_PIN ||
    ''
  ).trim();
  if (!baseMaterial) return null;

  return crypto
    .createHmac('sha256', 'pleadings-session-key-derivation-v1')
    .update(baseMaterial)
    .digest('hex');
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  // Hash both to fixed 32-byte digests so length differences never short-circuit timing
  const hashA = crypto.createHash('sha256').update(bufA).digest();
  const hashB = crypto.createHash('sha256').update(bufB).digest();
  return crypto.timingSafeEqual(hashA, hashB) && bufA.length === bufB.length;
}

/**
 * Generates an scrypt password hash string for storing in ADMIN_PASSWORD_HASH:
 * format: scrypt$<hexSalt>$<hexDerivedKey>
 */
export function hashAdminPassword(plainPassword: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plainPassword, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

function verifyScryptHash(candidate: string, encodedHash: string): boolean {
  const parts = encodedHash.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;

  try {
    const derived = crypto.scryptSync(candidate, salt, 64);
    const expected = Buffer.from(expectedHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

/**
 * Returns true if at least one admin authentication secret is configured via environment variables.
 * Fails closed when unconfigured — ZERO hardcoded passwords exist anywhere in source.
 */
export function isAdminAuthConfigured(): boolean {
  return Boolean(
    (process.env.ADMIN_PASSWORD_HASH || '').trim() ||
    (process.env.ADMIN_KEY || '').trim() ||
    (process.env.ADMIN_PASSWORD || '').trim() ||
    (process.env.ADMIN_PIN || '').trim()
  );
}

/**
 * Validates an admin master passkey against environment-configured credentials ONLY.
 * Uses constant-time comparisons and scrypt verification.
 */
export function validateAdminCredential(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (!trimmed || !isAdminAuthConfigured()) return false;

  const passwordHash = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (passwordHash && verifyScryptHash(trimmed, passwordHash)) {
    return true;
  }

  const envKeys = [
    process.env.ADMIN_KEY,
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_PIN,
  ]
    .map((v) => (v || '').trim())
    .filter(Boolean);

  let matched = false;
  for (const expected of envKeys) {
    const unquoted = expected.replace(/^["']|["']$/g, '').trim();
    if (timingSafeStringEqual(trimmed, expected) || timingSafeStringEqual(trimmed, unquoted)) {
      matched = true;
    }
  }
  return matched;
}

function signPayload(encodedPayload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');
}

/**
 * Creates a signed, expiring, revocable admin session token (HMAC-SHA256).
 */
export function createAdminSessionToken(ttlSeconds = ADMIN_SESSION_TTL_SECONDS): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    v: 1,
    sub: 'admin',
    iat: nowSec,
    exp: nowSec + ttlSeconds,
    jti: crypto.randomUUID(),
  };

  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const signature = signPayload(encoded, secret);
  return `${encoded}.${signature}`;
}

/**
 * Verifies a signed admin session token (signature, structure, expiry, and revocation list).
 */
export function verifyAdminSessionToken(token?: string | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0 || dotIdx === token.length - 1) return null;

  const encoded = token.slice(0, dotIdx);
  const providedSig = token.slice(dotIdx + 1);
  const expectedSig = signPayload(encoded, secret);

  if (!timingSafeStringEqual(providedSig, expectedSig)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<SessionPayload>;
    if (
      parsed.v !== 1 ||
      parsed.sub !== 'admin' ||
      typeof parsed.exp !== 'number' ||
      typeof parsed.iat !== 'number' ||
      typeof parsed.jti !== 'string'
    ) {
      return null;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (parsed.exp <= nowSec) return null;

    pruneRevokedSessions(nowSec);
    if (revokedSessionIds.has(parsed.jti)) return null;

    return parsed as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Revokes an active session token immediately on logout.
 */
export function revokeAdminSessionToken(token?: string | null): void {
  const payload = verifyAdminSessionToken(token);
  if (payload) {
    revokedSessionIds.set(payload.jti, payload.exp);
  }
}

export async function isServerAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(verifyAdminSessionToken(session));
}

export function isRequestAuthenticated(request: NextRequest): boolean {
  const cookieVal = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (verifyAdminSessionToken(cookieVal)) return true;

  // Allow Bearer header ONLY with a valid signed session token (never raw passwords)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice('Bearer '.length).trim();
    if (verifyAdminSessionToken(bearerToken)) {
      return true;
    }
  }

  return false;
}
