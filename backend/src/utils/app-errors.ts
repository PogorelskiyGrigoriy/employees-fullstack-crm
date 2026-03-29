import {type AppErrorCode } from "@crm/shared/types/error.types.js";

/**
 * Base class for all operational errors.
 */
export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number,
    public code: AppErrorCode,
    public details: unknown = null
  ) {
    super(message);
    // Standard boilerplate for custom errors in TS
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, 'AUTH_REQUIRED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, 'FORBIDDEN');
  }
}

/**
 * Error for malformed requests or invalid parameters.
 * Use this for general 400 errors that are not schema-related.
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    // Assuming 'BAD_REQUEST' is available in your AppErrorCode union
    super(message, 400, 'BAD_REQUEST' as AppErrorCode);
  }
}