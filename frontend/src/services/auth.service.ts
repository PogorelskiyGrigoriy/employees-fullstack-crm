import { type AuthService as AuthServiceShared } from "@crm/shared/types/auth.types.js";
import { type UserData } from "@crm/shared/schemas/auth.schema.js";

/** * Frontend Auth Service:
 * Extends shared logic with UI-specific session management.
 */
export interface AuthService extends Omit<AuthServiceShared, 'validateUser' | 'logout'> {
  logout(): Promise<void>;
  
  getCurrentUser(): Promise<UserData | null>;
}