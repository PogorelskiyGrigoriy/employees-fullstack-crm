import { api } from "@/api/axios-instance";
import { type UserData, type CreateUserDto, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { type AuditLog } from "@crm/shared/schemas/audit.schema.js";
import type { UserService } from "./user.service";

class UserServiceRest implements UserService {
    async getUsers(): Promise<UserData[]> {
        const { data } = await api.get<UserData[]>("/users");
        return data;
    }

    async getUserById(id: string): Promise<UserData> {
        const { data } = await api.get<UserData>(`/users/${id}`);
        return data;
    }

    async getAuditLogs(): Promise<AuditLog[]> {
        const { data } = await api.get<AuditLog[]>("/users/logs");
        return data;
    }

    async createUser(payload: CreateUserDto): Promise<UserData> {
        const { data } = await api.post<UserData>("/users", payload);
        return data;
    }

    async updateUser(id: string, payload: UpdateUserDto): Promise<UserData> {
        const { data } = await api.patch<UserData>(`/users/${id}`, payload);
        return data;
    }

    async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    }
}

export const userService: UserService = new UserServiceRest();