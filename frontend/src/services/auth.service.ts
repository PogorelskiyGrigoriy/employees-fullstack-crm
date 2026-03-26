import type { IAuthService } from "@crm/shared/types/auth.types.js";
import type { UserData } from "@crm/shared/schemas/auth.schema.js";

/** 
 * Frontend version includes UI-specific session management 
 */
export interface AuthService extends IAuthService {
  logout(): Promise<void>;
  getCurrentUser?(): Promise<UserData | null>;
}