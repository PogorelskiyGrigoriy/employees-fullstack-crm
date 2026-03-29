/**
 * @module Seeder
 * Utilities for generating mock data for Employees and Users.
 */
import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { type UserRole } from '@crm/shared/schemas/auth.schema.js';

/**
 * Pre-hashed version of the string "password".
 * Using a constant saves CPU cycles during mock generation.
 */
const MOCK_PASSWORD_HASH = "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  role: UserRole;
}

/**
 * Generates an array of mock users.
 */
export const generateMockUsers = (count: number): MockUser[] => {
  return Array.from({ length: count }, () => ({
    id: randomUUID(),
    email: faker.internet.email().toLowerCase(),
    passwordHash: MOCK_PASSWORD_HASH,
    username: faker.internet.username(),
    role: faker.helpers.arrayElement(['USER', 'ADMIN'] as UserRole[]),
  }));
};