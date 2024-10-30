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
  try {
    const hasAuthCookie = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token');

    if (request.nextUrl.pathname.startsWith("/protected") && !hasAuthCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && hasAuthCookie) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (e) {
    // If there's an error, return response with security headers
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }
}
