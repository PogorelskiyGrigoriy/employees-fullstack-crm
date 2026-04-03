/**
 * @module ApiClientImplementation
 * REST implementation of the ApiClient interface using centralized API_ENDPOINTS.
 */
import { api } from "@/shared/api/axios-instance";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import type { AxiosRequestConfig } from "axios";
import { 
  employeeSchema, 
  type Employee, 
  type NewEmployee, 
  type EmployeeUpdatePayload,
  type EmployeeFilter
} from "@crm/shared/schemas/employee.schema.js";
import type { SortState } from "@/features/sort-employees/model/sort-store";
import type { ApiClient } from "./api-client";
import type { StatsResponse } from "@crm/shared/schemas/stats.schema.js";
import type { UserData } from "@crm/shared/schemas/auth.schema.js";

class ApiClientRest implements ApiClient {
  
  async getEmployees(filters?: EmployeeFilter, sort?: SortState, config?: AxiosRequestConfig): Promise<Employee[]> {
    const params = this.buildParams(filters, sort, config?.params);
    const { data } = await api.get<unknown[]>(API_ENDPOINTS.EMPLOYEES.BASE, { ...config, params });

    return data.reduce<Employee[]>((acc, item) => {
      const result = employeeSchema.safeParse(item);
      if (result.success) acc.push(result.data);
      else console.error("[API Data Corruption]:", result.error.format());
      return acc;
    }, []);
  }

  async addEmployee(employee: NewEmployee): Promise<Employee> {
    const { data } = await api.post<unknown>(API_ENDPOINTS.EMPLOYEES.BASE, employee);
    return employeeSchema.parse(data);
  }

  async deleteEmployee(id: string): Promise<void> {
    // Больше никаких ручных строк с косой чертой
    await api.delete(API_ENDPOINTS.EMPLOYEES.BY_ID(id));
  }

  async updateEmployee({ id, changes }: EmployeeUpdatePayload): Promise<Employee> {
    const { data } = await api.patch<unknown>(API_ENDPOINTS.EMPLOYEES.BY_ID(id), changes);
    return employeeSchema.parse(data);
  }

  async getStatistics(): Promise<StatsResponse> {
    const { data } = await api.get<StatsResponse>(API_ENDPOINTS.EMPLOYEES.STATS);
    return data;
  }

  async getMe(): Promise<Omit<UserData, 'token'>> {
    const { data } = await api.get(API_ENDPOINTS.AUTH.ME);
    return data as Omit<UserData, 'token'>;
  }

  private buildParams(filters?: EmployeeFilter, sort?: SortState, baseParams?: any) {
    const params = { ...baseParams };
    if (filters) Object.assign(params, filters);
    if (sort?.key && sort?.order) {
      params.sortBy = sort.key;
      params.sortOrder = sort.order;
    }
    return params;
  }
}

export const apiClient: ApiClient = new ApiClientRest();