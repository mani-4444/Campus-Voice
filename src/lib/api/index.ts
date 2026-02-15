// ──────────────────────────────────────────────
// API utilities placeholder
// Will house fetch wrappers, error handling, and
// request helpers once the backend is live.
// ──────────────────────────────────────────────

/**
 * Generic API response wrapper.
 * Every service function should return this shape.
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/** Helper to build a success response */
export function ok<T>(data: T): ApiResponse<T> {
  return { data, error: null };
}

/** Helper to build an error response */
export function err<T = never>(message: string): ApiResponse<T> {
  return { data: null, error: message };
}
