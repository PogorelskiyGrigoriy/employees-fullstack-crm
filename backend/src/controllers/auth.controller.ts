/**
 * @module AuthController
 * Handles identity-related requests such as login and session validation.
 */
import type { Request, Response, NextFunction } from 'express';
import { type AuthService } from '@crm/shared/types/auth.types.js';
import { loginSchema } from '@crm/shared/schemas/auth.schema.js';
import { UnauthorizedError } from '../utils/app-errors.js';
import logger from '../utils/pino-logger.js';

export class AuthController {
  /**
   * We depend on the AuthService interface, not a concrete implementation.
   * This allows the controller to work with Memory, Prisma, or MongoDB seamlessly.
   */
  constructor(private authService: AuthService) {}

  /**
   * Authenticates a user and returns their profile with a JWT.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Validate request body against shared Zod schema
      const credentials = loginSchema.parse(req.body);

      // 2. Delegate authentication logic to the service
      const userData = await this.authService.login(credentials);

      // 3. Return consistent user data structure
      res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Retrieves the current user's profile based on the verified JWT.
   * Expects req.user to be populated by the 'protect' middleware.
   */
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        // Use our specialized AppError for consistent global handling
        throw new UnauthorizedError("User session not found or expired");
      }

      // Fetch fresh user data (without sensitive fields) using the ID from the token
      const user = await this.authService.validateUser(req.user.id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        logger.info({ userId: req.user.id }, "User logged out");
        await this.authService.logout(req.user.id);
      }
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}