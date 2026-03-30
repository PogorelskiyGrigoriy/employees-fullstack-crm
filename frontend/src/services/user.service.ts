import { type UserData, type CreateUserDto, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { type AuditLog } from "@crm/shared/schemas/audit.schema.js";

export interface UserService {
  // Management (CRUD)
  getUsers(): Promise<UserData[]>;
  getUserById(id: string): Promise<UserData>;
  createUser(data: CreateUserDto): Promise<UserData>;
  updateUser(id: string, data: UpdateUserDto): Promise<UserData>;
  deleteUser(id: string): Promise<void>;
  // Accounting (Audit)
  getAuditLogs(): Promise<AuditLog[]>;
}