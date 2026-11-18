import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  isAdminAuthConfigured,
  isRequestAuthenticated,
  revokeAdminSessionToken,
  validateAdminCredential,
} from '@/lib/auth';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';
import { AdminLoginSchema } from '@/lib/security/schemas';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
};

// GET: Check current authentication status
export async function GET(request: NextRequest) {
  const isAuth = isRequestAuthenticated(request);
  return NextResponse.json({ authenticated: isAuth }, { headers: NO_STORE_HEADERS });
}

// POST: Log in with environment-configured Admin Master Key / Password
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  if (!isAdminAuthConfigured()) {
    logSecurityEvent('admin_auth_misconfigured', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Administrative authentication is not configured on this server.' },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  // Strict brute-force rate limit: 5 attempts per 15 minutes per IP
  const rl = await checkRateLimit(clientIp, {
    prefix: 'admin-login',
    limit: 5,
    windowSec: 15 * 60,
  });

  if (!rl.allowed) {
    logSecurityEvent('admin_login_rate_limited', 'warn', {
      ip: clientIp,
      retryAfterSec: rl.retryAfterSec,
    });
    return NextResponse.json(
      {
        success: false,
        error: `Too many failed login attempts. Try again in ${Math.ceil(rl.retryAfterSec / 60)} minute(s).`,
      },
      {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          'Retry-After': String(rl.retryAfterSec),
        },
      }
    );
  }

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = AdminLoginSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication payload.' },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const key = parsed.data.key || parsed.data.password || parsed.data.pin || '';

    if (!validateAdminCredential(key)) {
      logSecurityEvent('admin_login_failed', 'warn', {
        ip: clientIp,
        remainingAttempts: rl.remaining,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid Administrative Key. Access Denied.' },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    const sessionToken = createAdminSessionToken(ADMIN_SESSION_TTL_SECONDS);
    if (!sessionToken) {
      logSecurityEvent('admin_session_creation_failed', 'error', { ip: clientIp });
      return NextResponse.json(
        { success: false, error: 'Unable to initialize secure session.' },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    });

    logSecurityEvent('admin_login_success', 'info', { ip: clientIp });

    // Never leak the session token into the JSON body (HttpOnly cookie only)
    return NextResponse.json(
      {
        success: true,
        message: 'Authenticated successfully',
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch {
    logSecurityEvent('admin_login_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Authentication service error.' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

// DELETE: Log out & revoke session token
export async function DELETE(request: NextRequest) {
  const clientIp = getClientIp(request);
  const existingToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  revokeAdminSessionToken(existingToken);

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);

  logSecurityEvent('admin_logout', 'info', { ip: clientIp });
  return NextResponse.json(
    { success: true, message: 'Logged out successfully' },
    { headers: NO_STORE_HEADERS }
  );
}
