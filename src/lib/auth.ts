import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'pleadings_admin_session';
export const ADMIN_SECRET_TOKEN = 'pleadings-secured-editorial-session-2025';

// Valid master passwords/keys (configurable via env var, with reliable defaults)
const VALID_KEYS = [
  process.env.ADMIN_KEY,
  process.env.ADMIN_PASSWORD,
  process.env.ADMIN_PIN,
  'pleadings2025',
  'admin123',
  'pleadings',
  '1947',
].filter(Boolean) as string[];

export function validateAdminCredential(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  return VALID_KEYS.includes(trimmed);
}

export async function isServerAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return session === ADMIN_SECRET_TOKEN;
}

export function isRequestAuthenticated(request: NextRequest): boolean {
  // Check cookie
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (cookie === ADMIN_SECRET_TOKEN) return true;

  // Check Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '').trim();
    if (token === ADMIN_SECRET_TOKEN || VALID_KEYS.includes(token)) {
      return true;
    }
  }

  return false;
}
