import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('x-frame-options', 'DENY');
  response.headers.set('x-content-type-options', 'nosniff');
  response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
  response.headers.set('x-xss-protection', '1; mode=block');
  response.headers.set('strict-transport-security', 'max-age=31536000; includeSubDomains');

  // Check protected routes
  if (request.nextUrl.pathname.startsWith("/protected")) {
    const hasAuthCookie = request.cookies.has('sb-access-token') || 
                         request.cookies.has('sb-refresh-token');

    if (!hasAuthCookie) {
      const redirectUrl = new URL("/sign-in", request.url);
      redirectUrl.searchParams.set("redirect_to", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
