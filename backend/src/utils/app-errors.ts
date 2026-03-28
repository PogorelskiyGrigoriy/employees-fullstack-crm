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