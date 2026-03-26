/**
 * @module AuthService
 * Implementation of IAuthService using in-memory storage for development and testing.
 * Uses bcrypt-ts for environment-independent password hashing.
 */
import jwt from "jsonwebtoken";
import { compare } from "bcrypt-ts";
import type { IAuthService } from "@crm/shared/types/auth.types.js";
import type { UserData, LoginData, JwtPayload } from "@crm/shared/schemas/auth.schema.js";
import { ENV } from "../../config/env.js";

export class InMemoryAuthService implements IAuthService {
  /**
   * Mock users database for testing RBAC.
   * Both users use the password: "password"
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
    
    // Check if user exists and verify password using bcrypt-ts (async compare)
    const isPasswordValid = user ? await compare(password, user.passwordHash) : false;

    if (!user || !isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Token payload follows the shared interface
    const payload: JwtPayload = { 
      id: user.id, 
      role: user.role 
    };

    /**
     * Generate the JWT.
     * We use NonNullable to satisfy strict TypeScript checks for expiresIn.
     */
    const token = jwt.sign(
      payload, 
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as NonNullable<jwt.SignOptions['expiresIn']> }
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
   * Validates a user's existence by ID. Essential for the /me endpoint.
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