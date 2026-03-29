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
import { generateMockUsers } from '../../utils/users-seeder.js';
import logger from '../../utils/pino-logger.js';

/**
 * Internal record type that includes sensitive password hashes.
 */
type UserRecord = Omit<UserData, 'token'> & { passwordHash: string };

export class InMemoryUserService implements UserService {
  /**
   * Mock database for testing and development.
   * Default password for all users: "password"
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
   * Constructor seeds the database if seedCount is provided.
   */
  constructor(seedCount: number = 0) {
    if (seedCount > 0) {
      const mockUsers = generateMockUsers(seedCount);
      this.users.push(...mockUsers);
      
      // Log seeded emails to the console for easy frontend testing
      const seededEmails = mockUsers.map(u => `${u.email} (${u.role})`);
      logger.info({ emails: seededEmails }, `Seeded ${seedCount} users. Password for all: "password"`);
    }
  }

  /**
   * Returns all users without sensitive data.
   */
  async getAll(): Promise<Omit<UserData, 'token'>[]> {
    return this.users.map(({ passwordHash, ...user }) => user);
  }

  /**
   * Finds a user by ID. Throws NotFoundError if not found.
   */
  async getById(id: string): Promise<Omit<UserData, 'token'>> {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundError(`User with ID ${id}`);
    
    const { passwordHash, ...userData } = user;
    return userData;
  }

  /**
   * Internal helper for Auth logic to retrieve the password hash.
   */
  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  /**
   * Creates a new user with password hashing and email uniqueness check.
   */
  async create(data: CreateUserDto): Promise<Omit<UserData, 'token'>> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictError(`User with email ${data.email} already exists`);
    }

    const passwordHash = await hash(data.password, 10);

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
   * Updates user data. Uses nullish coalescing to prevent overwriting with undefined.
   */
  async update(id: string, data: UpdateUserDto): Promise<Omit<UserData, 'token'>> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundError(`User with ID ${id}`);

    const current = this.users[index]!;

    if (data.email && data.email !== current.email) {
      const existing = await this.findByEmail(data.email);
      if (existing) throw new ConflictError(`Email ${data.email} is already taken`);
    }

    let passwordHash = current.passwordHash;
    if (data.password) {
      passwordHash = await hash(data.password, 10);
    }

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
   * Deletes a user by ID. Throws NotFoundError if not found.
   */
  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new NotFoundError(`User with ID ${id}`);

    this.users.splice(index, 1);
  }
}