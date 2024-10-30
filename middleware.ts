import { createServerClient } from "@supabase/ssr";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from './utils/security-headers';
import { cookies } from 'next/headers';

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
    // Create supabase server client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Check auth status
    const { data: { session } } = await supabase.auth.getSession();

    // Clone response
    const res = NextResponse.next();

    // Add security headers
    for (const [key, value] of Object.entries(securityHeaders)) {
      res.headers.set(key, value);
    }

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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
