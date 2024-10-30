import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin'
};

export async function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/protected");
  const isHomePage = request.nextUrl.pathname === "/";
  const hasAuthCookie = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token');

  if (isProtectedRoute && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isHomePage && hasAuthCookie) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  return NextResponse.next({
    headers: securityHeaders
  });
}
