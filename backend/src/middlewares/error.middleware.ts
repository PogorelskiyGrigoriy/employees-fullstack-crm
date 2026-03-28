import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-errors.js";
import type { ApiErrorResponse } from "@crm/shared/types/error.types.js";
import logger from "../utils/pino-logger.js";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let response: ApiErrorResponse = {
    error: "Internal Server Error",
    code: "SERVER_ERROR",
    timestamp: new Date().toISOString(),
  };

  // 1. Handle our custom AppErrors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    response = {
      error: err.message,
      code: err.code,
      details: err.details,
      timestamp: new Date().toISOString(),
    };
    logger.warn({ response, path: req.path }, "Operational error caught");
  } 
  
  // 2. Handle Zod validation errors automatically
  else if (err instanceof ZodError) {
    statusCode = 400;
    response = {
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: err.issues.map(i => ({ path: i.path, message: i.message })),
      timestamp: new Date().toISOString(),
    };
  } 

  // 3. Fallback for unknown errors (programming bugs, DB connection lost, etc.)
  else {
    logger.error({ 
      err: { message: err.message, stack: err.stack }, 
      path: req.path 
    }, "Unhandled system error");
  }

  res.status(statusCode).json(response);
};