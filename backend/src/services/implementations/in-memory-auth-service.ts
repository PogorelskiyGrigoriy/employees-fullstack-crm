/**
 * @module AuthService
 * Implementation of IAuthService using in-memory storage for development and testing.
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { IAuthService } from "@crm/shared/types/auth.js";
import type { UserData, LoginData, JwtPayload } from "@crm/shared/schemas/auth.schema.js";
import { ENV } from "../../config/env.js";

export class InMemoryAuthService implements IAuthService {
  /**
   * Mock users database for testing RBAC.
   * Both users use the password: "password123"
   */
  private users = [
    { 
      id: "admin-1", 
      email: "admin@crm.com", 
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 
      username: "System Admin", 
      role: "ADMIN" as const 
    },
    { 
      id: "user-2", 
      email: "user@crm.com", 
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 
      username: "Regular User", 
      role: "USER" as const 
    }
  ];

  /**
   * Validates credentials and generates a JWT.
   */
  async login(credentials: LoginData): Promise<UserData> {
    const { email, password } = credentials;
    const user = this.users.find(u => u.email === email);
    
    // Verify user existence and password validity
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error("Invalid credentials");
    }

    // Prepare the token payload based on the shared interface
    const payload: JwtPayload = { 
      id: user.id, 
      role: user.role 
    };

    /**
     * Generate the JWT.
     * Type assertion for 'expiresIn' is required because jsonwebtoken expects 
     * specific string literals or numbers, while Zod provides a generic string.
     */
    const token = jwt.sign(
      payload, 
      ENV.JWT_SECRET,
      {expiresIn: ENV.JWT_EXPIRES_IN as NonNullable<jwt.SignOptions['expiresIn']>}
    );

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    };
  }

  /**
   * Validates a user's existence by ID. Useful for session persistence.
   */
  async validateUser(id: string): Promise<Omit<UserData, 'token'>> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}