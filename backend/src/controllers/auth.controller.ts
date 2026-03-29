/**
 * @module AuthController
 * Handles identity-related requests and logs security events (Accounting).
 */
import type { Request, Response, NextFunction } from 'express';
import { type AuthService } from '@crm/shared/types/auth.types.js';
import { type AuditService } from '@crm/shared/types/audit.types.js'; // NEW
import { loginSchema } from '@crm/shared/schemas/auth.schema.js';
import { UnauthorizedError } from '../utils/app-errors.js';

export class AuthController {
  /**
   * Controller now depends on both Auth (Identity) and Audit (Accounting).
   */
  constructor(
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  /**
   * Authenticates a user and records the login event.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const userData = await this.authService.login(credentials);

      // AAA: Accounting - Log successful login
      await this.auditService.log({
        userId: userData.id,
        username: userData.username,
        action: 'USER_LOGIN',
        metadata: { ip: req.ip } // Useful for security audits
      });

      res.json(userData);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Retrieves current session data. 
   * Note: We do NOT log this to avoid spamming the audit trail.
   */
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("Session not found");
      const user = await this.authService.validateUser(req.user.id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Handles logout and records the session termination.
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        // AAA: Accounting - Log logout event
        await this.auditService.log({
          userId: req.user.id,
          username: 'User', // Placeholder until we add username to JWT payload
          action: 'USER_LOGOUT'
        });

        await this.authService.logout(req.user.id);
      }
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}