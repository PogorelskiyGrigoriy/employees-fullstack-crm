import { type AuditLog } from '../schemas/audit.schema.js';

/**
 * Interface for the Accounting layer (Audit Trail).
 */
export interface AuditService {
  log(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void>;
  getLogs(): Promise<AuditLog[]>;
}