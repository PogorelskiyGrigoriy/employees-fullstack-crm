import type { LoginData, UserData } from "../schemas/auth.schema.js";

export interface AuthService {
  login(credentials: LoginData): Promise<UserData>;
  validateUser(id: string): Promise<Omit<UserData, 'token'>>;
}