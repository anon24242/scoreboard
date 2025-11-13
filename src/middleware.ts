import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || session !== 'admin-logged-in') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname === '/login') {
    if (session === 'admin-logged-in') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
