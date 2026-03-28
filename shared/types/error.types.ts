/**
 * @module ErrorTypes
 * Shared error contracts to ensure consistency between Frontend and Backend.
 */

/**
 * Machine-readable error codes for frontend logic.
 * These are independent of the database implementation.
 */
export type AppErrorCode = 
  | 'VALIDATION_ERROR'    // Zod failed
  | 'NOT_FOUND'           // 404
  | 'AUTH_REQUIRED'       // 401
  | 'FORBIDDEN'           // 403 (RBAC)
  | 'CONFLICT'            // 409 (Duplicate entry)
  | 'SERVER_ERROR'        // 500
  | 'NETWORK_ERROR';      // Client-side only

/**
 * Detailed structure for validation issues (Zod integration).
 */
export interface ValidationErrorDetail {
  path: (string | number)[];
  message: string;
}

/**
 * The standard API response for any non-2xx status code.
 */
export interface ApiErrorResponse {
  /** Human-readable message for UI (Toasts/Modals) */
  error: string;
  
  /** Machine-readable code for logic (Redirects/Form handling) */
  code: AppErrorCode;
  
  /** Technical details (e.g., Zod issues or non-sensitive debug info) */
  details?: ValidationErrorDetail[] | unknown;
  
  /** Timestamp for support/logging */
  timestamp: string;
}