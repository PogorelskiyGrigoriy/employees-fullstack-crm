/**
 * @module ServiceFactory
 * Centralized service provider for the application.
 * Manages Singletons and cross-service dependencies (DI).
 */
import { ENV } from '../config/env.js';
import logger from '../utils/pino-logger.js';

// Interfaces
import { type EmployeesService } from './employees.service.js';
import { type UserService } from '@crm/shared/types/user.types.js';
import { type AuthService } from '@crm/shared/types/auth.types.js';

// Implementations (In-Memory)
import { InMemoryEmployeesService } from './implementations/employees-in-memory.service.js';
import { InMemoryUserService } from './implementations/user-in-memory.service.js';
import { InMemoryAuthService } from './implementations/auth-in-memory.service.js';

export class ServiceFactory {
  private static employeesInstance: EmployeesService | null = null;
  private static usersInstance: UserService | null = null;
  private static authInstance: AuthService | null = null;

  /**
   * Returns a singleton instance of EmployeesService.
   */
  static getEmployeesService(): EmployeesService {
    if (this.employeesInstance) return this.employeesInstance;

    const dbType = ENV.DB_TYPE;
    try {
      if (dbType === 'IN_MEMORY') {
        logger.info({ dbType, mockCount: 25 }, 'Initializing Employees database provider');
        this.employeesInstance = new InMemoryEmployeesService(25);
      } else {
        throw new Error(`${dbType} implementation for Employees is not ready yet.`);
      }
      return this.employeesInstance;
    } catch (error) {
      logger.fatal({ err: error, dbType }, 'Failed to initialize EmployeesService');
      throw error;
    }
  }

  /**
   * Returns a singleton instance of UserService.
   */
  static getUsersService(): UserService {
    if (this.usersInstance) return this.usersInstance;

    const dbType = ENV.DB_TYPE;
    try {
      if (dbType === 'IN_MEMORY') {
        logger.info({ dbType }, 'Initializing Users database provider');
        this.usersInstance = new InMemoryUserService();
      } else {
        throw new Error(`${dbType} implementation for Users is not ready yet.`);
      }
      return this.usersInstance;
    } catch (error) {
      logger.fatal({ err: error, dbType }, 'Failed to initialize UserService');
      throw error;
    }
  }

  /**
   * Returns a singleton instance of AuthService.
   * Note: AuthService DEPENDS on UserService.
   */
  static getAuthService(): AuthService {
    if (this.authInstance) return this.authInstance;

    const dbType = ENV.DB_TYPE;
    try {
      // Get the required dependency first
      const userService = this.getUsersService();

      if (dbType === 'IN_MEMORY') {
        logger.info({ dbType }, 'Initializing Auth provider with injected UserService');
        this.authInstance = new InMemoryAuthService(userService);
      } else {
        throw new Error(`${dbType} implementation for Auth is not ready yet.`);
      }
      return this.authInstance;
    } catch (error) {
      logger.fatal({ err: error, dbType }, 'Failed to initialize AuthService');
      throw error;
    }
  }

  /**
   * Clears all singleton instances for testing purposes.
   */
  static resetServices(): void {
    logger.warn('All ServiceFactory instances have been reset');
    this.employeesInstance = null;
    this.usersInstance = null;
    this.authInstance = null;
  }
}