/**
 * @module AuthSchema
 * Validation logic for Authentication and User Management.
 * Updated for Zod 4.3.x standards.
 */

import { z } from "zod";
import { emailSchema, passwordSchema } from "./common.schema.js";

/**
 * RBAC Roles
 */
export const userRoleSchema = z.enum(['ADMIN', 'USER']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Base User Entity
 * Use this for Database services and General User lists.
 */
export const userSchema = z.object({
  id: z.string().min(1, "ID is required"),
  username: z.string().min(1, "Username is required"),
  email: emailSchema,
  role: userRoleSchema,
});

// Exported base type without token for Backend Services
export type User = z.infer<typeof userSchema>;

/**
 * 1. FOR AUTH SERVICE: Response after login
 * In a successful login scenario, the token is MANDATORY.
 */
export const userDataSchema = userSchema.extend({
  token: z.string().min(1, "Auth token is required"), 
});
export type UserData = z.infer<typeof userDataSchema>;

/**
 * 2. FOR AUTH SERVICE: Login request
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginData = z.infer<typeof loginSchema>;

/**
 * 3. FOR USER SERVICE: Create User (Admin action)
 */
export const createUserSchema = userSchema.omit({ id: true }).extend({
  password: passwordSchema,
});
export type CreateUserDto = z.infer<typeof createUserSchema>;

/**
 * 4. FOR USER SERVICE: Update User (Admin action)
 */
export const updateUserSchema = createUserSchema.partial();
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/**
 * Decoded JWT Payload
 */
export interface JwtPayload {
  id: string;
  role: UserRole;
}