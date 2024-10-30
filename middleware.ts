import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

// Define security headers inline for Edge compatibility
const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
} as const;

export async function middleware(request: NextRequest) {
  // Check for auth cookies
  const hasAuthCookie = request.cookies.has('sb-access-token') || 
                       request.cookies.has('sb-refresh-token');

  // Protected routes check
  if (request.nextUrl.pathname.startsWith("/protected") && !hasAuthCookie) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect_to", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl, {
      headers: securityHeaders
    });
  }

  // Home route redirect
  if (request.nextUrl.pathname === "/" && hasAuthCookie) {
    return NextResponse.redirect(new URL("/protected", request.url), {
      headers: securityHeaders
    });
  }

  // Add security headers to all responses
  return NextResponse.next({
    headers: securityHeaders
  });
}
