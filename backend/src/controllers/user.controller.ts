/**
 * @module UserController
 * Handles administrative actions for managing users (CRUD) and auditing.
 */
import type { Request, Response, NextFunction } from 'express';
import { type UserService } from '@crm/shared/types/user.types.js';
import { type AuditService } from '@crm/shared/types/audit.types.js';
import { createUserSchema, updateUserSchema } from '@crm/shared/schemas/auth.schema.js';
import { BadRequestError, UnauthorizedError } from '../utils/app-errors.js';

export class UserController {
  /**
   * Controller coordinates between Data management (UserService) 
   * and Accounting (AuditService).
   */
  constructor(
    private userService: UserService,
    private auditService: AuditService
  ) {}

  /**
   * Internal helper to extract ID and ensure actor is identified.
   */
  private getActor(req: Request) {
    if (!req.user) throw new UnauthorizedError("Actor identification failed");
    // Placeholder name 'Admin' - will be replaced by actual username from JWT later
    return { id: req.user.id, name: 'Admin' }; 
  }

  /**
   * Helper to validate and extract ID from request parameters.
   */
  private getParamId(req: Request): string {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      throw new BadRequestError("Valid ID parameter is required");
    }
    return id;
  }

  /**
   * Retrieves all users (without tokens/passwords).
   */
  getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      res.json(users);
    } catch (e) { next(e); }
  };

  /**
   * Retrieves a single user profile by ID.
   * Note: Read operations are typically NOT logged in the Audit trail.
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.getParamId(req);
      const user = await this.userService.getById(id);
      res.json(user);
    } catch (e) { next(e); }
  };

  /**
   * Retrieves the full audit trail (Accounting).
   */
  getAuditLogs = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.auditService.getLogs();
      res.json(logs);
    } catch (e) { next(e); }
  };

  /**
   * Creates user and logs the action.
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = this.getActor(req);
      const data = createUserSchema.parse(req.body);
      const newUser = await this.userService.create(data);

      await this.auditService.log({
        userId: actor.id,
        username: actor.name,
        action: 'USER_CREATE',
        targetId: newUser.id
      });

      res.status(201).json(newUser);
    } catch (e) { next(e); }
  };

  /**
   * Updates user and logs specific action type (Update vs Role Change).
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = this.getActor(req);
      const id = this.getParamId(req);
      const data = updateUserSchema.parse(req.body);
      
      const updatedUser = await this.userService.update(id, data);

      const action = data.role ? 'ROLE_CHANGE' : 'USER_UPDATE';

      await this.auditService.log({
        userId: actor.id,
        username: actor.name,
        action,
        targetId: id,
        metadata: data.role ? { oldRole: '?', newRole: data.role } : undefined
      });

      res.json(updatedUser);
    } catch (e) { next(e); }
  };

  /**
   * Deletes user and logs the action.
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = this.getActor(req);
      const id = this.getParamId(req);
      
      await this.userService.delete(id);

      await this.auditService.log({
        userId: actor.id,
        username: actor.name,
        action: 'USER_DELETE',
        targetId: id
      });

      res.status(204).send();
    } catch (e) { next(e); }
  };
}