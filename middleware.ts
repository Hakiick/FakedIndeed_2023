import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedRoutes = ['/profile', '/addAd', '/editAd', '/applicants', '/admin'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  const isAdmin = adminRoutes.some(route => pathname.startsWith(route));
  if (isAdmin && payload.userType !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/addAd/:path*', '/editAd/:path*', '/applicants/:path*', '/admin/:path*'],
};
