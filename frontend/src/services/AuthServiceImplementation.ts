/**
 * @module AuthServiceImplementation
 * Communicates with the Express Backend via REST.
 */

import { api } from "@/api/axiosInstance";
import { userDataSchema, type LoginData, type UserData } from "@crm/shared/schemas/auth.schema.js";
import type { AuthService } from "./AuthService";

class AuthServiceRest implements AuthService {
  async login(credentials: LoginData): Promise<UserData> {
    // Send credentials to the real backend
    const { data } = await api.post<UserData>("/auth/login", credentials);
    
    // Validate that server response matches our schema
    return userDataSchema.parse(data);
  }

  async logout(): Promise<void> {
    // For now, logout is handled by clearing the Store on the client side.
    // Later, you can add a POST /auth/logout if you use server-side sessions.
    return Promise.resolve();
  }
}

export const authService: AuthService = new AuthServiceRest();