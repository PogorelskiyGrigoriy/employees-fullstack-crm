import { 
  type User, 
  type CreateUserDto, 
  type UpdateUserDto 
} from "../schemas/auth.schema.js";

/**
 * Internal type for Authentication logic.
 * Represents a user record as stored in the database with their password hash.
 */
export type UserWithPassword = User & { passwordHash: string };

/**
 * Standard CRUD contract for user management.
 * All methods now use the base 'User' entity (no token involved).
 */
export interface UserService {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<void>;
  
  /**
   * Internal helper for Auth logic.
   * Returns the user along with their password hash for verification.
   */
  findByEmail(email: string): Promise<UserWithPassword | null>;
}