/**
 * @module AuthService
 * Agnostic implementation of AuthService.
 * Depends on UserService for user data retrieval and validation.
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
   * Injecting UserService to decouple identity management from session logic.
   */
  constructor(private userService: UserService) {}

  /**
   * Authenticates user via email/password and signs a JWT.
   */
  async login(credentials: LoginData): Promise<UserData> {
    const { email, password } = credentials;

    // Delegate user lookup to the dedicated UserService
    const user = await this.userService.findByEmail(email);
    
    // Verify password using the hash retrieved from UserService
    const isPasswordValid = user ? await compare(password, user.passwordHash) : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload: JwtPayload = { 
      id: user.id, 
      role: user.role 
    };

    /**
     * Generate the token using configuration from environment variables.
     */
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

  /**
   * Verifies user existence for session persistence (the /me endpoint).
   */
  async validateUser(id: string): Promise<Omit<UserData, 'token'>> {
    return await this.userService.getById(id);
  }

  /**
   * Handles user logout.
   * In a stateless JWT setup, the server doesn't need to do much,
   * but this method provides a hook for future session invalidation logic.
   */
  async logout(userId: string): Promise<void> {
    // For now, we simply acknowledge the logout. 
    // In the future, this is where you'd clear Refresh Tokens or add to a Blacklist.
    return Promise.resolve();
  }
}