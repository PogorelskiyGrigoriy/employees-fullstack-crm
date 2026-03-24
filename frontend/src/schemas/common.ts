/**
 * @module CommonSchema
 * Reusable validation primitives and common TypeScript interfaces.
 * These schemas serve as building blocks for more complex data models.
 */

import { z } from "zod";

/**
 * Generic name validation:
 * - Minimum 3 characters
 * - Supports Latin, Cyrillic, spaces, and common name punctuation (hyphens, apostrophes)
 */
export const nameSchema = z.string()
  .min(3, "Minimum 3 characters required")
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s`’'-]+$/, "Only letters and hyphens are allowed");

/**
 * Standard email validation with mandatory presence check.
 */
export const emailSchema = z.email({ message: "Invalid email address format" })
  .min(1, { message: "Email is required" });

/**
 * Basic password validation.
 * Ensures the password has a minimum length for fundamental security.
 */
export const passwordSchema = z.string()
  .min(6, "Password must be at least 6 characters");

/**
 * Validates that a string is a properly formatted ISO date.
 * Ensures the string can be correctly parsed by the JavaScript Date object.
 */
export const dateStringSchema = z.string()
  .min(1, "Date is required")
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });

/**
 * Generic interface for UI Select/Dropdown components.
 * Commonly used for filtering and form selection inputs.
 */
export interface FilterOption {
  readonly label: string; // The text shown to the user
  readonly value: string; // The actual data value (ID or slug)
}