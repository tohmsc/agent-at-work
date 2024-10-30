import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { config } from './config/middleware-config';

export { config };

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
} as const;

// Custom error types for better error handling
type MiddlewareError = {
  code: string;
  message: string;
  status: number;
};

// Error handling utility
function handleMiddlewareError(error: unknown): NextResponse {
  console.error('Middleware Error:', error);
  
  // Default error response
  const defaultError: MiddlewareError = {
    code: 'INTERNAL_ERROR',
    message: 'An internal error occurred',
    status: 500
  };

  // Handle specific error types
  let responseError = defaultError;
  
  if (error instanceof Error) {
    if (error.message.includes('auth')) {
      responseError = {
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
        status: 401
      };
    } else if (error.message.includes('rate')) {
      responseError = {
        code: 'RATE_LIMIT',
        message: 'Too many requests',
        status: 429
      };
    }
  }

  // Create error response with security headers
  return new NextResponse(
    JSON.stringify({ 
      error: responseError.message,
      code: responseError.code 
    }), {
      status: responseError.status,
      headers: {
        'Content-Type': 'application/json',
        ...securityHeaders
      }
    }
  );
}

function validateAuthCookie(request: NextRequest): boolean {
  const accessToken = request.cookies.get('sb-access-token')?.value;
  return !!accessToken && accessToken.length > 0;
}

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

      // Additional auth validation if needed
      if (!validateAuthCookie(request)) {
        throw new Error('auth');
      }
    }

    // Home route redirect
    if (request.nextUrl.pathname === "/" && hasAuthCookie) {
      return NextResponse.redirect(new URL("/protected", request.url), {
        headers: securityHeaders
      });
    }

    // Create base response
    const response = NextResponse.next();

    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return handleMiddlewareError(error);
  }
}
