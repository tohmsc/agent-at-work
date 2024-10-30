import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Explicitly set segment runtime to edge
export const runtime = "edge";
export const preferredRegion = "auto";

export function middleware(request: NextRequest) {
  // Basic security headers
  const headers = new Headers({
    'x-frame-options': 'DENY',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin'
  });

  // Protected route check
  if (request.nextUrl.pathname.startsWith("/protected")) {
    const hasAuth = request.cookies.has('sb-access-token');
    if (!hasAuth) {
      return NextResponse.redirect(new URL("/sign-in", request.url), { headers });
    }
  }

  // Apply headers to all responses
  const response = NextResponse.next();
  headers.forEach((value, key) => response.headers.set(key, value));
  return response;
}

// Simplified matcher
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
};
