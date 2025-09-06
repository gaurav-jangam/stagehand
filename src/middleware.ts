
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  let session;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie.value);
    } catch (e) {
      session = null;
    }
  }

  const isTryingToAccessDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  if (isTryingToAccessDashboard) {
    if (!session || new Date(session.expires) <= new Date()) {
      // Not authenticated or session expired, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/dashboard/:path*',
};
