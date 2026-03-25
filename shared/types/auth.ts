import type { LoginData, UserData } from "../schemas/auth.schema.js";

/** 
 * Basic contract that both Client and Server must follow 
 */
export interface IAuthService {
  login(credentials: LoginData): Promise<UserData>;
}