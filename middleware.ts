import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config } from './config/middleware-config';

export { config };

// Define security headers as a Headers object instead of a plain object
const securityHeaders = new Headers({
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
});

export function middleware(request: NextRequest) {
  try {
    const hasAuthCookie = request.cookies.has('sb-access-token') || 
                         request.cookies.has('sb-refresh-token');

    // Protected routes check
    if (request.nextUrl.pathname.startsWith("/protected")) {
      if (!hasAuthCookie) {
        const redirectUrl = new URL("/sign-in", request.url);
        redirectUrl.searchParams.set("redirect_to", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
      }

      if (!validateAuthCookie(request)) {
        throw new Error('auth');
      }
    }

    // Home route redirect
    if (request.nextUrl.pathname === "/" && hasAuthCookie) {
      const response = NextResponse.redirect(new URL("/protected", request.url));
      securityHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Create base response
    const response = NextResponse.next();

    // Add security headers to all responses
    securityHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return handleMiddlewareError(error);
  }
}

function validateAuthCookie(request: NextRequest): boolean {
  const accessToken = request.cookies.get('sb-access-token')?.value;
  return !!accessToken && accessToken.length > 0;
}

function handleMiddlewareError(error: unknown): NextResponse {
  console.error('Middleware Error:', error);
  
  const defaultError = {
    code: 'INTERNAL_ERROR',
    message: 'An internal error occurred',
    status: 500
  };

  let responseError = defaultError;
  
  if (error instanceof Error) {
    if (error.message.includes('auth')) {
      responseError = {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
        status: 401
      };
    }
  }

  const response = NextResponse.json({ 
    error: responseError.message,
    code: responseError.code 
  }, {
    status: responseError.status
  });

  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}
