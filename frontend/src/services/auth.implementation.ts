import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { userDataSchema, type LoginData, type UserData } from "@crm/shared/schemas/auth.schema.js";
import { useAuthStore } from "@/store/auth-store";
import type { AuthService } from "./auth.service";

class AuthServiceRest implements AuthService {
  async login(credentials: LoginData): Promise<UserData> {
    const { data } = await api.post<UserData>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return userDataSchema.parse(data);
  }

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      useAuthStore.getState().setLogout();
    }
  }

  async getCurrentUser(): Promise<UserData | null> {
    try {
      const { data } = await api.get<UserData>(API_ENDPOINTS.AUTH.ME);
      return userDataSchema.parse(data);
    } catch {
      return null;
    }
  }
}

export const authService: AuthService = new AuthServiceRest();