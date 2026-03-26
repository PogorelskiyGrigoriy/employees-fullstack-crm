/**
 * @module ErrorHelpers
 * Utilities for parsing and formatting Zod validation errors.
 * Transforms complex error objects into human-readable strings for the UI.
 */

import { z, ZodError } from "zod";

/**
 * Converts a ZodError into an array of readable strings.
 * Each string identifies the failing field and its corresponding error message.
 * @param error - The ZodError object caught during validation.
 * @returns An array of strings, e.g., ["email: Invalid email address", "password: Min 6 characters"]
 */
export const formatZodError = (error: ZodError): string[] => {
  return error.issues.map((issue: z.ZodIssue) => {
    // Join path parts (e.g., ['user', 'address', 'street'] -> "user.address.street")
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${path}: ${issue.message}`;
  });
};

/**
 * Converts a ZodError into a single concatenated string for brief notifications (e.g., Toasts).
 * @param error - The ZodError object.
 * @returns A single string with errors separated by pipes.
 */
export const formatZodErrorToString = (error: ZodError): string => {
  return formatZodError(error).join(" | ");
};