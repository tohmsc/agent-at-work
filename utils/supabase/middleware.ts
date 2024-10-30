import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

const securityHeaders = {
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin'
};

export const updateSession = async (request: NextRequest) => {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => request.cookies.get(name)?.value,
          set: (name: string, value: string, options: any) => {},
          remove: (name: string, options: any) => {}
        },
      }
    );

    const user = await supabase.auth.getUser();

    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': new URL("/sign-in", request.url).toString(),
          ...securityHeaders
        }
      });
    }

    if (request.nextUrl.pathname === "/" && !user.error) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': new URL("/protected", request.url).toString(),
          ...securityHeaders
        }
      });
    }

    return new Response(null, {
      status: 200,
      headers: securityHeaders
    });
  } catch (e) {
    return new Response(null, {
      status: 200,
      headers: securityHeaders
    });
  }
};
