import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    // Skip static files and API routes
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Protected route check
    if (request.nextUrl.pathname.startsWith("/protected")) {
      const hasAuth = request.cookies.has('sb-access-token')
      if (!hasAuth) {
        console.warn(`Unauthorized access attempt to ${request.nextUrl.pathname}`)
        return NextResponse.redirect(new URL("/sign-in", request.url))
      }
    }

    // Add security headers
    const response = NextResponse.next()
    try {
      response.headers.set('x-frame-options', 'DENY')
      response.headers.set('x-content-type-options', 'nosniff')
      response.headers.set('referrer-policy', 'strict-origin-when-cross-origin')
    } catch (headerError) {
      console.error('Error setting security headers:', headerError)
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

// Configure matcher
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
