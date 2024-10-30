import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
  unstable_allowDynamic: [
    '/node_modules/next/dist/compiled/ua-parser-js/**',
  ],
};

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
};

export async function middleware(request: NextRequest) {
  // Basic auth check without user agent parsing
  const hasAuthCookie = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token');
  
  // Create response with security headers
  const response = NextResponse.next({
    headers: securityHeaders
  });

  // Protected routes check
  if (request.nextUrl.pathname.startsWith("/protected") && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url), {
      headers: securityHeaders
    });
  }

  // Home route redirect
  if (request.nextUrl.pathname === "/" && hasAuthCookie) {
    return NextResponse.redirect(new URL("/protected", request.url), {
      headers: securityHeaders
    });
  }

  return response;
}
