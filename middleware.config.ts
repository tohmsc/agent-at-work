export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/node_modules/@supabase/supabase-js/**',
    '**/node_modules/@supabase/ssr/**',
    '**/node_modules/jose/**',
  ],
  regions: ['iad1'], // Optional: Specify regions for better performance
}; 