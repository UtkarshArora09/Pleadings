import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, isRequestAuthenticated } from '@/lib/auth';

/**
 * Next.js 16 Server Proxy:
 * Enforces server-side authentication on /admin/* pages and /api/admin/* endpoints
 * before any Admin UI bundle or handler executes.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow login page and auth endpoint through
  if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  const authenticated = isRequestAuthenticated(request);

  if (!authenticated) {
    // Reject unauthorized admin API requests with 401 JSON
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid admin session required.' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        }
      );
    }

    // Redirect unauthenticated /admin/* page requests server-side to /admin/login
    const loginUrl = new URL('/admin/login', request.url);
    const fullTarget = `${pathname}${search}`;
    if (fullTarget.startsWith('/admin') && !fullTarget.startsWith('/admin/login')) {
      loginUrl.searchParams.set('returnUrl', fullTarget);
    }
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.cookies.delete(ADMIN_COOKIE_NAME);
    redirectRes.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    redirectRes.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return redirectRes;
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
