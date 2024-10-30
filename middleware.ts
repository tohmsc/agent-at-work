import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define security headers inline
const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
};

export function middleware(request: NextRequest) {
  // Protected route check
  if (request.nextUrl.pathname.startsWith("/protected")) {
    const hasAuth = request.cookies.has('sb-access-token');
    if (!hasAuth) {
      const redirectUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
