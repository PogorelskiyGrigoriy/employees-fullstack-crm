/**
 * @module AuthService (Backend)
 */
import type { IAuthService } from "@crm/shared/types/auth.js";
import type { UserData, LoginData } from "@crm/shared/schemas/auth.schema.js";

export class InMemoryAuthService implements IAuthService {
  private users = [
    { id: "1", email: "admin@crm.com", password: "password123", username: "Admin", role: "ADMIN" as const },
    { id: "2", email: "user@crm.com", password: "password123", username: "Regular User", role: "USER" as const }
  ];

  async login(credentials: LoginData): Promise<UserData> {
    const { email, password } = credentials;

    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error("Invalid credentials");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: "mock-jwt-token-for-in-memory" 
    };
  }
}