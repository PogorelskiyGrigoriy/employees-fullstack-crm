/**
 * @module AuthService
 * Defines the contract for authentication providers.
 * Ensures consistency between Mock and Production API implementations.
 */

import type { LoginData, UserData } from "@/schemas/auth.schema";

/**
 * Interface for authentication logic.
 * Enforces strict typing for credentials and user profile data.
 */
export interface AuthService {
  /**
   * Authenticates a user with the provided credentials.
   * @param credentials - The user's email and password validated by loginSchema.
   * @returns A promise resolving to the validated UserData.
   */
  login(credentials: LoginData): Promise<UserData>;

  /**
   * Revokes the current session and performs cleanup on the server-side if necessary.
   * @returns A promise that resolves when the session is terminated.
   */
  logout(): Promise<void>;

  /**
   * [Optional] Restores the user session based on an existing token (e.g., on page refresh).
   * Useful for initial app mounting logic.
   */
  getCurrentUser?(): Promise<UserData | null>;
}