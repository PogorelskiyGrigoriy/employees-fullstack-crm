/**
 * @module InMemoryAuditService
 * Implements the Accounting layer of AAA.
 * Stores system actions in memory for administrative oversight.
 */
import { randomUUID } from 'node:crypto';
import { type AuditService } from '@crm/shared/types/audit.types.js';
import { type AuditLog } from '@crm/shared/schemas/audit.schema.js';
import logger from '../../utils/pino-logger.js';

export class InMemoryAuditService implements AuditService {
  /**
   * Internal storage for audit records.
   */
  private logs: AuditLog[] = [];

  /**
   * Maximum number of logs to keep in memory to prevent overflow.
   */
  private readonly MAX_LOGS = 1000;

  /**
   * Records a new action to the audit trail.
   * Generates unique ID and high-precision timestamp automatically.
   */
  async log(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog: AuditLog = {
      ...data,
      id: randomUUID(),
      timestamp: new Date().toISOString(), // Matches z.string().datetime({ precision: 3 })
    };

    // Add to the beginning of the array (newest first)
    this.logs.unshift(newLog);

    // Maintain memory limits
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    /**
     * Professional Standard: Echo audit events to the system logger.
     * This allows real-time monitoring via terminal/external logging tools.
     */
    logger.info(
      { 
        auditAction: newLog.action, 
        actor: newLog.username, 
        target: newLog.targetId 
      }, 
      `Audit log recorded: ${newLog.action}`
    );
  }

  /**
   * Retrieves all recorded logs.
   */
  async getLogs(): Promise<AuditLog[]> {
    return this.logs;
  }
}