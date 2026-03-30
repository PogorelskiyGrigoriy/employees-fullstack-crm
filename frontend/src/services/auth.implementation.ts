import { api } from "@/api/axios-instance";
import { userDataSchema, type LoginData, type UserData } from "@crm/shared/schemas/auth.schema.js";
import { useAuthStore } from "@/store/auth-store";
import type { AuthService } from "./auth.service";

class AuthServiceRest implements AuthService {
  async login(credentials: LoginData): Promise<UserData> {
    const { data } = await api.post<UserData>("/auth/login", credentials);
    return userDataSchema.parse(data);
  }

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      // Обязательно чистим стейт, даже если бэкенд недоступен
      useAuthStore.getState().setLogout();
    }
  }

  async getCurrentUser(): Promise<UserData | null> {
    try {
      const { data } = await api.get<UserData>("/auth/me");
      return userDataSchema.parse(data);
    } catch {
      return null;
    }
  }
}

export const authService: AuthService = new AuthServiceRest();