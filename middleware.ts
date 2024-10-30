import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protected route check
  if (request.nextUrl.pathname.startsWith("/protected")) {
    const hasAuth = request.cookies.has('sb-access-token');
    if (!hasAuth) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Add security headers directly
  const response = NextResponse.next();
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
