import { api } from "@/shared/api/axios-instance";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { userDataSchema, type UserData } from "@crm/shared/schemas/auth.schema.js";

export interface UserApi {
  getCurrentUser(): Promise<UserData | null>;
}

export const userApi = {

  async getCurrentUser(): Promise<UserData | null> {
    try {
      const { data } = await api.get<UserData>(API_ENDPOINTS.AUTH.ME);
      return userDataSchema.parse(data);
    } catch {
      return null;
    }
  },
};