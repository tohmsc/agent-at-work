import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  runtime: 'edge',
  regions: ['iad1'],
};

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin'
};

export async function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token');

  if (request.nextUrl.pathname.startsWith("/protected") && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (request.nextUrl.pathname === "/" && hasAuthCookie) {
    return NextResponse.redirect(new URL("/protected", request.url));
  }

  return NextResponse.next({
    headers: securityHeaders
  });
}
