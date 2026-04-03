import { api } from "@/shared/api/axios-instance";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { userDataSchema, type LoginData, type UserData } from "@crm/shared/schemas/auth.schema.js";

export interface AuthApi {
  login(credentials: LoginData): Promise<UserData>;
  logout(): Promise<void>;
}

export const authApi = {
  async login(credentials: LoginData): Promise<UserData> {
    const { data } = await api.post<UserData>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return userDataSchema.parse(data);
  },

  async logout(): Promise<void> {
    // Здесь ТОЛЬКО сетевой запрос. 
    // Очистку стора мы перенесем в хук useLogout в слое features.
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};