import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { securityHeaders } from "@/utils/security-headers";

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

export async function middleware(request: NextRequest) {
  const hasAuthCookie = request.cookies.has('sb-access-token') || 
                       request.cookies.has('sb-refresh-token');

  // Create response with security headers
  const response = NextResponse.next({
    headers: securityHeaders
  });

  // Handle authentication redirects
  if (request.nextUrl.pathname.startsWith("/protected") && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url), {
      headers: securityHeaders
    });
  }

  return response;
}
