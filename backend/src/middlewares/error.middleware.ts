import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-errors.js";
import type { ApiErrorResponse, AppErrorCode } from "@crm/shared/types/error.types.js";
import logger from "../utils/pino-logger.js";
import { ZodError } from "zod";

/**
 * Global Error Handling Middleware.
 * Standardizes all error responses according to the ApiErrorResponse contract.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // 1. Default values for unhandled (500) errors
  let statusCode = 500;
  let code: AppErrorCode = 'SERVER_ERROR';
  let message = 'Internal Server Error';
  let details: unknown = null;

  // 2. Map specific error types to our response variables
  if (err instanceof AppError) {
    /** Handle known operational errors (404, 409, 401, etc.) */
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;

    logger.warn({ code, message, path: req.path }, "Operational error caught");
  } 
  else if (err instanceof ZodError) {
    /** Handle schema validation errors from Zod */
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.issues.map(i => ({ path: i.path, message: i.message }));

    // Optional: log as warning if you want to track frequent client validation failures
    logger.warn({ path: req.path, issues: details }, "Validation error");
  } 
  else {
    /** Handle unexpected system errors (Programming bugs, Database connection loss) */
    logger.error(
      { 
        err: { message: err.message, stack: err.stack }, 
        path: req.path 
      }, 
      "Unhandled system exception"
    );
  }

  // 3. Construct the final response object exactly once (DRY principle)
  const response: ApiErrorResponse = {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
  };

  // 4. Send the standardized response
  res.status(statusCode).json(response);
};