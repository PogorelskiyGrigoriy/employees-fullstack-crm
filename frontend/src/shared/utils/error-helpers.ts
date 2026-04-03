/**
 * @module ErrorHelpers
 * Optimized utilities for formatting validation errors from both 
 * local Zod validation and remote Backend API responses.
 */
import { ZodError } from "zod";
import type { ValidationErrorDetail } from "@crm/shared/types/error.types";
import { isRouteErrorResponse } from "react-router-dom";
import axios from "axios";
import type { ApiErrorResponse } from "@crm/shared/types/error.types";

/**
 * Normalizes input and converts validation issues into a flat array of readable strings.
 */
export const formatValidationErrors = (
  error: ZodError | ValidationErrorDetail[]
): string[] => {
  const issues = error instanceof ZodError ? error.issues : error;

  return issues.map(({ path, message }) => {
    const pathString = path.length > 0 ? path.join(".") : "root";
    return `${pathString}: ${message}`;
  });
};

/**
 * Concatenates errors into a single string for brief notifications.
 */
export const formatValidationErrorsToString = (
  error: ZodError | ValidationErrorDetail[]
): string => formatValidationErrors(error).join(" | ");

export const getErrorData = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.status === 404 ? "Page Not Found" : "Router Error",
      desc: error.statusText || "Navigation error occurred.",
      debug: JSON.stringify(error.data)
    };
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (!error.response) {
      return {
        status: "Network",
        title: "Connection Failed",
        desc: "Unable to connect to the server. Please check your internet.",
        debug: error.message
      };
    }

    return {
      status: error.response.status,
      title: data?.code || "Server Error",
      desc: data?.error || error.message,
      debug: JSON.stringify({ code: data?.code, ts: data?.timestamp, url: error.config?.url }, null, 2),
      validation: data?.code === "VALIDATION_ERROR" ? (data.details as ValidationErrorDetail[]) : null
    };
  }

  const err = error as Error;
  return { status: "App", title: "Internal Error", desc: err.message, debug: err.stack };
};