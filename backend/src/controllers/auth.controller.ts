/**
 * @module AuthController
 * Handles authentication requests (login, session validation).
 */
import type { Request, Response, NextFunction } from 'express';
import { InMemoryAuthService } from '../services/implementations/auth-in-memory.service.js';
import { loginSchema } from '@crm/shared/schemas/auth.schema.js';

export class AuthController {
  constructor(private authService: InMemoryAuthService) {}

  /**
   * Handles user login and returns a JWT token.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const userData = await this.authService.login(credentials);
      res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Returns current user data based on a valid token.
   * Requires 'protect' middleware to be executed before this.
   */
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user is populated by 'protect' middleware
      if (!req.user) {
        return res.status(401).json({ error: "User not identified" });
      }

      const user = await this.authService.validateUser(req.user.id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };
}