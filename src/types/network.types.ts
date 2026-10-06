/**
 * Centralized network/API types.
 * Every service file should import from here instead of
 * redefining its own response/error shapes.
 */

/** Actual shape our backend returns — confirmed via existing `res.data?.status` checks. */
export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data: T;
}

/** Normalized error shape returned by handleApiError(). Use this in try/catch blocks in UI code. */
export interface ApiError {
  status: number | null;
  code: string | null;
  message: string;
  isNetworkError: boolean;
  raw?: unknown;
}

/** Shape of a typical paginated list response. */
export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}
