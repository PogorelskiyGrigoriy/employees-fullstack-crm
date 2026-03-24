/**
 * @module AuthSchema
 * Validation schemas for authentication and user authorization.
 * Built with Zod for runtime type checking and TypeScript inference.
 */

import { z } from "zod";
import { emailSchema, passwordSchema } from "./common";

/**
 * Enumeration of available user roles.
 * Used for Role-Based Access Control (RBAC) throughout the application.
 */
export const userRoleSchema = z.enum(['ADMIN', 'USER']);

/** Type representing valid user roles ('ADMIN' | 'USER') */
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Validation schema for the login form.
 * Ensures email format and password complexity rules are met.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/** Data structure for login submissions */
export type LoginData = z.infer<typeof loginSchema>;

/**
 * Validation schema for the authenticated user profile.
 * Defines the shape of the user object stored in global state or session.
 */
export const userDataSchema = z.object({
  id: z.string().uuid().or(z.string()), // ID can be a UUID or a standard string
  username: z.string().min(1, "Username is required"),
  role: userRoleSchema,
});

/** Type representing the profile of an authenticated user */
export type UserData = z.infer<typeof userDataSchema>;