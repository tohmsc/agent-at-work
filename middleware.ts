import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-xss-protection': '1; mode=block',
  'strict-transport-security': 'max-age=31536000; includeSubDomains'
};

export async function middleware(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // We don't need to set cookies in middleware
            return
          },
          remove(name: string, options: CookieOptions) {
            // We don't need to remove cookies in middleware
            return
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    // For protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && !session) {
      return NextResponse.redirect(new URL("/sign-in", request.url), {
        headers: securityHeaders
      });
    }

    // For home route
    if (request.nextUrl.pathname === "/" && session) {
      return NextResponse.redirect(new URL("/protected", request.url), {
        headers: securityHeaders
      });
    }

    // For all other routes
    return NextResponse.next({
      headers: securityHeaders
    });
  } catch (e) {
    // If there's an error, allow the request to continue but ensure security headers
    return NextResponse.next({
      headers: securityHeaders
    });
  }
}
