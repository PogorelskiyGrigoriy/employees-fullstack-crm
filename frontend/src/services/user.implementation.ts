import { api } from "@/shared/api/axios-instance";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { type UserData, type CreateUserDto, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { type AuditLog } from "@crm/shared/schemas/audit.schema.js";
import type { UserService } from "./user.service";

class UserServiceRest implements UserService {
    async getUsers(): Promise<UserData[]> {
        const { data } = await api.get<UserData[]>(API_ENDPOINTS.USERS.BASE);
        return data;
    }

    async getUserById(id: string): Promise<UserData> {
        const { data } = await api.get<UserData>(API_ENDPOINTS.USERS.BY_ID(id));
        return data;
    }

    async getAuditLogs(): Promise<AuditLog[]> {
        const { data } = await api.get<AuditLog[]>(API_ENDPOINTS.USERS.LOGS);
        return data;
    }

    async createUser(payload: CreateUserDto): Promise<UserData> {
        const { data } = await api.post<UserData>(API_ENDPOINTS.USERS.BASE, payload);
        return data;
    }

    async updateUser(id: string, payload: UpdateUserDto): Promise<UserData> {
        const { data } = await api.patch<UserData>(API_ENDPOINTS.USERS.BY_ID(id), payload);
        return data;
    }

    async deleteUser(id: string): Promise<void> {
        await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
    }
}

export const userService: UserService = new UserServiceRest();