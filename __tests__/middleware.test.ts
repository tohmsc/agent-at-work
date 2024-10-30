import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '../middleware'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({
      headers: new Map(),
    })),
    redirect: jest.fn((url) => ({
      url,
      headers: new Map(),
    })),
  },
  NextURL: jest.fn(),
}))

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should add security headers to response', () => {
    const request = new NextRequest(new URL('http://localhost:3000'))
    const response = middleware(request)

    expect(response.headers.get('x-frame-options')).toBe('DENY')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin')
  })

  test('should redirect to sign-in for protected routes without auth', () => {
    const request = new NextRequest(new URL('http://localhost:3000/protected'))
    const response = middleware(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/sign-in'
      })
    )
  })

  test('should allow access to protected routes with auth token', () => {
    const request = new NextRequest(new URL('http://localhost:3000/protected'))
    request.cookies.set('sb-access-token', 'valid-token')
    
    const response = middleware(request)
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  test('should skip middleware for static files', () => {
    const request = new NextRequest(new URL('http://localhost:3000/_next/static/file.js'))
    middleware(request)
    
    expect(NextResponse.next).toHaveBeenCalled()
  })
}) 