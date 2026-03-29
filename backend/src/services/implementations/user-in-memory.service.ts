/**
 * @module InMemoryUserService
 * Implementation of UserService using an in-memory array.
 * Integrates with bcrypt-ts for security and custom AppErrors for flow control.
 */
import { randomUUID } from 'node:crypto';
import { hash } from 'bcrypt-ts';
import { type UserService } from "@crm/shared/types/user.types.js";
import { 
  type UserData, 
  type CreateUserDto, 
  type UpdateUserDto 
} from "@crm/shared/schemas/auth.schema.js";
import { NotFoundError, ConflictError } from "../../utils/app-errors.js";

/**
 * Internal record type including sensitive password hashes.
 */
type UserRecord = Omit<UserData, 'token'> & { passwordHash: string };

export class InMemoryUserService implements UserService {
  /**
   * Mock users database for testing and development.
   * Default password for both: "password"
   */
  private users: UserRecord[] = [
    { 
      id: "admin-1", 
      email: "admin@crm.com", 
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 
      username: "System Admin", 
      role: "ADMIN" 
    },
    { 
      id: "user-2", 
      email: "user@crm.com", 
      passwordHash: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", 
      username: "Regular User", 
      role: "USER" 
    }
  ];

  /**
   * Retrieves all users without password hashes.
   */
  async getAll(): Promise<Omit<UserData, 'token'>[]> {
    return this.users.map(({ passwordHash, ...user }) => user);
  }

  /**
   * Retrieves a single user by ID. Throws NotFoundError if missing.
   */
  async getById(id: string): Promise<Omit<UserData, 'token'>> {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundError(`User with ID ${id}`);
    
    const { passwordHash, ...userData } = user;
    return userData;
  }

  /**
   * Internal helper to find a user by email, including the password hash.
   */
  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  /**
   * Creates a new user with a hashed password.
   */
  async create(data: CreateUserDto): Promise<Omit<UserData, 'token'>> {
    // 1. Check for email uniqueness
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`User with email ${data.email} already exists`);
    }

    // 2. Hash the raw password
    const passwordHash = await hash(data.password, 10);

    // 3. Persist the record
    const newUser: UserRecord = {
      id: randomUUID(),
      username: data.username,
      email: data.email,
      role: data.role,
      passwordHash,
    };

    this.users.push(newUser);

    const { passwordHash: _, ...result } = newUser;
    return result;
  }

  /**
   * Updates an existing user. Uses nullish coalescing to prevent undefined values.
   */
  async update(id: string, data: UpdateUserDto): Promise<Omit<UserData, 'token'>> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundError(`User with ID ${id}`);

    const current = this.users[index]!;

    // 1. Validate email uniqueness if it is being changed
    if (data.email && data.email !== current.email) {
      const existing = await this.findByEmail(data.email);
      if (existing) throw new ConflictError(`Email ${data.email} is already taken`);
    }

    // 2. Hash new password if provided, otherwise keep existing hash
    let passwordHash = current.passwordHash;
    if (data.password) {
      passwordHash = await hash(data.password, 10);
    }

    // 3. Merge data safely without 'password' field in final record
    const updatedUser: UserRecord = {
      id: current.id, 
      username: data.username ?? current.username,
      email: data.email ?? current.email,
      role: data.role ?? current.role,
      passwordHash,
    };

    this.users[index] = updatedUser;

    const { passwordHash: _, ...result } = updatedUser;
    return result;
  }

  /**
   * Removes a user by ID. Throws NotFoundError if missing.
   */
  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundError(`User with ID ${id}`);

    this.users.splice(index, 1);
  }
}