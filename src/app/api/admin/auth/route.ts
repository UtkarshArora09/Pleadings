import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SECRET_TOKEN,
  validateAdminCredential,
  isRequestAuthenticated,
} from '@/lib/auth';

// GET: Check current authentication status
export async function GET(request: NextRequest) {
  const isAuth = isRequestAuthenticated(request);
  return NextResponse.json({ authenticated: isAuth });
}

// POST: Log in with Master Key / PIN / Password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = body.key || body.password || body.pin || '';

    if (!validateAdminCredential(key)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Administrative Key. Access Denied.' },
        { status: 401 }
      );
    }

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      token: ADMIN_SECRET_TOKEN,
      message: 'Authenticated successfully',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication error' },
      { status: 500 }
    );
  }
}

// DELETE: Log out
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
