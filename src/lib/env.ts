// ──────────────────────────────────────────────
// Safe environment variable access
// Warns in dev if a variable is missing — never crashes.
// ──────────────────────────────────────────────

function getEnv(key: string, required = false): string {
  const value = process.env[key] ?? "";
  if (!value && required && process.env.NODE_ENV === "development") {
    console.warn(`[env] Missing environment variable: ${key}`);
  }
  return value;
}

/** Public Supabase URL (safe for browser) */
export const SUPABASE_URL = getEnv("NEXT_PUBLIC_SUPABASE_URL");

/** Public Supabase anon key (safe for browser) */
export const SUPABASE_ANON_KEY = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

/** Server-only service role key — never import this in client components */
export const SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");
