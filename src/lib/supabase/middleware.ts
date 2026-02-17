import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the Supabase session and returns an updated response.
 * Called from src/middleware.ts on every matched request.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Always create the Supabase server client so cookies are synced ──
  // Even on public routes the client must run so that session cookies
  // set during signIn are properly forwarded in the response.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Public routes — still refresh session (cookie sync) but skip the
  // expensive getUser() network call & never redirect.
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth");

  if (isPublicRoute) {
    // Touch the session so cookies flow through
    await supabase.auth.getSession();
    console.log(`[Middleware] ${pathname} → public, skipping auth check`);
    return supabaseResponse;
  }

  // ── Protected routes — verify user via network call ──
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  console.log(`[Middleware] ${pathname} → user: ${user ? user.email : "none"}`);

  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/faculty") ||
    pathname.startsWith("/issues") ||
    pathname.startsWith("/report") ||
    pathname.startsWith("/locations");

  if (!user && isDashboardRoute) {
    console.log(`[Middleware] No user on protected route → /login`);
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
