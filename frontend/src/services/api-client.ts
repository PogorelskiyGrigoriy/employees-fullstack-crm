/**
 * @module ApiClient
 * Abstract interface for employee management data provider with Zod validation.
 */
import type { AxiosRequestConfig } from "axios";
import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload,
  EmployeeFilter 
} from "@crm/shared/schemas/employee.schema";
import type { UserData } from "@crm/shared/schemas/auth.schema";
import type { SortState } from "@/features/sort-employees/model/sort-store";
import type { StatsResponse } from "@crm/shared/schemas/stats.schema.js";

export interface ApiClient {
  getEmployees(filters?: EmployeeFilter, sort?: SortState, config?: AxiosRequestConfig): Promise<Employee[]>;
  addEmployee(employee: NewEmployee): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  updateEmployee(payload: EmployeeUpdatePayload): Promise<Employee>;
  getStatistics(): Promise<StatsResponse>;
  
  /**
   * Validates current token and returns user profile.
   */
  getMe(): Promise<Omit<UserData, 'token'>>;
}