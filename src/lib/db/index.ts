// ──────────────────────────────────────────────
// Database client placeholder
// Replace this stub with Supabase client once live.
// ──────────────────────────────────────────────

/**
 * Placeholder database client.
 * Currently returns null — backend has not been connected.
 *
 * Usage (future):
 *   import { getDbClient } from "@/lib/db";
 *   const db = getDbClient();
 */
export function getDbClient(): null {
  if (process.env.NODE_ENV === "development") {
    console.warn("[db] Database client not configured — using mock data.");
  }
  return null;
}

export const db = getDbClient();
