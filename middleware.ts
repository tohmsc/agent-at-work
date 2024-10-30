import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
};

export async function middleware(request: NextRequest) {
  try {
    const hasAuthCookie = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token');

    // For protected routes, redirect to sign-in if no auth cookie
    if (request.nextUrl.pathname.startsWith("/protected") && !hasAuthCookie) {
      const redirectUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(redirectUrl, {
        headers: securityHeaders,
      });
    }

    // For home route, redirect to protected if auth cookie exists
    if (request.nextUrl.pathname === "/" && hasAuthCookie) {
      const redirectUrl = new URL("/protected", request.url);
      return NextResponse.redirect(redirectUrl, {
        headers: securityHeaders,
      });
    }

    // For all other routes, just add security headers
    return NextResponse.next({
      headers: securityHeaders,
    });
  } catch (error) {
    // If there's an error, return response with security headers
    return NextResponse.next({
      headers: securityHeaders,
    });
  }
}
