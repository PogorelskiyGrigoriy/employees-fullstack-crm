/**
 * @module UserController
 * Handles administrative actions for managing users (CRUD).
 */
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { type UserService } from '@crm/shared/types/user.types.js';
import { createUserSchema, updateUserSchema } from '@crm/shared/schemas/auth.schema.js';
import { BadRequestError } from '../utils/app-errors.js';

export class UserController {
  constructor(private userService: UserService) {}

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
   * Retrieves all users from the system.
   */
  getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAll();
      res.json(users);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Retrieves a single user profile by ID.
   */
  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.getParamId(req);
      const user = await this.userService.getById(id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Creates a new user record.
   */
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = createUserSchema.parse(req.body);
      const newUser = await this.userService.create(data);
      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Updates existing user fields.
   */
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.getParamId(req);
      const data = updateUserSchema.parse(req.body);
      const updatedUser = await this.userService.update(id, data);
      res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Deletes a user record by ID.
   */
  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = this.getParamId(req);
      await this.userService.delete(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}