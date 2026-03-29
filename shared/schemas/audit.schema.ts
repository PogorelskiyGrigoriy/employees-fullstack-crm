import { z } from 'zod';

export const auditActionSchema = z.enum([
  'USER_LOGIN',
  'USER_LOGOUT',
  'USER_CREATE',
  'USER_UPDATE',
  'USER_DELETE',
  'ROLE_CHANGE'
]);

export type AuditAction = z.infer<typeof auditActionSchema>;

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime({ precision: 3 }),
  userId: z.string(),
  username: z.string(),
  action: auditActionSchema,
  targetId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;