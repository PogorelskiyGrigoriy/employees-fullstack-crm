/**
 * @module AuthServiceImplementation
 * Mock implementation of the AuthService interface.
 * Simulates real-world API behavior including network latency and schema validation.
 */

import { userDataSchema, type LoginData, type UserData } from "@/schemas/auth.schema";
import type { AuthService } from "./AuthService";

/**
 * Internal type for the mock database.
 * Extends the public UserData with a password field for credential verification.
 */
type MockUser = UserData & { password: string };

/**
 * Local in-memory database for development and testing.
 * Provides predefined accounts with different access levels (RBAC).
 */
const DUMMY_LOGIN_USERS: Record<string, MockUser> = {
  "admin@tel-ran.com": {
    id: crypto.randomUUID(),
    username: "Administrator",
    password: "admin1234",
    role: "ADMIN"
  },
  "user@tel-ran.com": {
    id: crypto.randomUUID(),
    username: "User",
    password: "user1234",
    role: "USER"
  }
};

/**
 * Helper utility to simulate asynchronous network latency.
 * @param ms - Delay duration in milliseconds.
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * AuthService implementation used during development or offline mode.
 * Mimics a real backend with validation logic and artificial delays.
 */
class AuthServiceDummy implements AuthService {
  /**
   * Authenticates a user against the local mock database.
   * @param credentials - Email and password validated by LoginData schema.
   * @throws Error if credentials do not match any record.
   * @returns A promise resolving to validated UserData.
   */
  async login({ email, password }: LoginData): Promise<UserData> {
    // Artificial delay to mimic server response time
    await delay(1000);
    const foundUser = DUMMY_LOGIN_USERS[email];

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Invalid email or password");
    }

    /**
     * Runtime validation check: 
     * Ensures the data being returned strictly conforms to the UserData schema 
     * before it is committed to the global state (Store).
     */
    return userDataSchema.parse(foundUser);
  }

  /**
   * Simulates a secure logout process.
   */
  async logout(): Promise<void> {
    await delay(500);
  }
}

/**
 * Exporting a singleton instance for application-wide authentication logic.
 */
export const authService: AuthService = new AuthServiceDummy();