/**
 * @module AuthSchema
 * Validation logic for authentication and RBAC.
 */

import { z } from "zod";
import { emailSchema, passwordSchema } from "./common.js";

/**
 * User roles for Role-Based Access Control.
 */
export const userRoleSchema = z.enum(['ADMIN', 'USER']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Credentials for login requests.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginData = z.infer<typeof loginSchema>;

/**
 * Authenticated user profile structure.
 */
export const userDataSchema = z.object({
  id: z.string().uuid().or(z.string()),
  username: z.string().min(1, "Username is required"),
  email: z.string().email(),
  role: userRoleSchema,
  token: z.string().optional(),
});

export type UserData = z.infer<typeof userDataSchema>;

/**
 * Decoded JWT payload structure.
 * Shared between AuthService and AuthMiddleware.
 */
export interface JwtPayload {
  id: string;
  role: UserRole;
}