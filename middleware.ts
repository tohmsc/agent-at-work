import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from './utils/security-headers';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Create supabase client
    const supabase = createClient(); // Remove `request`

    // Check auth status
    const { data: { session } } = await supabase.auth.getSession();

    // Clone response
    const res = NextResponse.next();

    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    // Handle protected routes
    if (pathname.startsWith('/protected') && !session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return res;
  } catch (e) {
    // Return basic response with security headers if middleware fails
    return NextResponse.next({
      headers: securityHeaders,
    });
  }
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
