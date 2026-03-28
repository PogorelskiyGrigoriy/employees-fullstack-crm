/**
 * @module ServiceFactory
 * Manages service instantiation based on environment configuration.
 * Uses Pino for structured logging and implements the Singleton pattern.
 */
import { ENV } from '../config/env.js';
import logger from '../utils/pino-logger.js';
import { type EmployeesService } from './employees.service.js';
import { InMemoryEmployeesService } from './implementations/employees-in-memory.service.js';

// Future implementations
// import { PrismaEmployeesService } from './implementations/employees-prisma.service.js';

export class ServiceFactory {
  private static employeesInstance: EmployeesService | null = null;

  /**
   * Returns a singleton instance of the EmployeesService.
   * Logs initialization details using Pino.
   */
  static getEmployeesService(): EmployeesService {
    if (this.employeesInstance) return this.employeesInstance;

    const dbType = ENV.DB_TYPE;

    try {
      switch (dbType) {
        case 'PRISMA':
          // this.employeesInstance = new PrismaEmployeesService();
          logger.error({ dbType }, 'Requested database provider is not implemented');
          throw new Error(`Prisma implementation is not ready. Switch DB_TYPE to IN_MEMORY in .env`);

        case 'MONGODB':
          logger.error({ dbType }, 'Requested database provider is not implemented');
          throw new Error(`MongoDB implementation is not ready.`);

        case 'IN_MEMORY':
        default:
          logger.info({ dbType, mockCount: 25 }, 'Initializing database provider');
          this.employeesInstance = new InMemoryEmployeesService(25);
          break;
      }

      return this.employeesInstance!;
    } catch (error) {
      // Ensuring the error is logged before the application potentially crashes or halts
      logger.fatal({ err: error, dbType }, 'Failed to initialize ServiceFactory');
      throw error;
    }
  }

  /**
   * Clears singleton instances for testing purposes.
   */
  static resetServices(): void {
    logger.warn('ServiceFactory instances have been reset');
    this.employeesInstance = null;
  }
}