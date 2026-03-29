/**
 * @module AuthService
 * Agnostic implementation of AuthService.
 * Depends on UserService for data retrieval.
 */
import jwt from "jsonwebtoken";
import { compare } from "bcrypt-ts";
import type { AuthService } from "@crm/shared/types/auth.types.js";
import type { UserService } from "@crm/shared/types/user.types.js";
import type { UserData, LoginData, JwtPayload } from "@crm/shared/schemas/auth.schema.js";
import { ENV } from "../../config/env.js";
import { UnauthorizedError } from "../../utils/app-errors.js";

export class InMemoryAuthService implements AuthService {
  /**
   * We inject the interface, not the concrete implementation.
   * This makes AuthService agnostic to whether users are in memory or Prisma.
   */
  constructor(private userService: UserService) {}

  async login(credentials: LoginData): Promise<UserData> {
    const { email, password } = credentials;

    // 1. Ask UserService for the user (including the password hash)
    const user = await this.userService.findByEmail(email);
    
    // 2. Security check
    const isPasswordValid = user ? await compare(password, user.passwordHash) : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // 3. Prepare Token Payload
    const payload: JwtPayload = { 
      id: user.id, 
      role: user.role 
    };

    const token = jwt.sign(
      payload, 
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    };
  }

  async validateUser(id: string): Promise<Omit<UserData, 'token'>> {
    return await this.userService.getById(id);
  }
}