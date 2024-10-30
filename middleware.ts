import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { securityHeaders } from "@/utils/security-headers";

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

// Simplified matcher
export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
