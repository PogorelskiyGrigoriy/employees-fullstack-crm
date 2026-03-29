import type { UserData, CreateUserDto, UpdateUserDto } from "../schemas/auth.schema.js";

/**
 * Standard CRUD contract for user management.
 */
export interface UserService {
  getAll(): Promise<Omit<UserData, 'token'>[]>;
  getById(id: string): Promise<Omit<UserData, 'token'>>;
  create(data: CreateUserDto): Promise<Omit<UserData, 'token'>>;
  update(id: string, data: UpdateUserDto): Promise<Omit<UserData, 'token'>>;
  delete(id: string): Promise<void>;
  
  // Internal helper for Auth logic
  findByEmail(email: string): Promise<(UserData & { passwordHash: string }) | null>;
}