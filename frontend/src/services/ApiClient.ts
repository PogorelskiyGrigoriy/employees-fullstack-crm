/**
 * @module ApiClient
 * Abstract interface for employee management data provider with Zod validation.
 */

import type { AxiosRequestConfig } from "axios";
import type { 
  Employee, 
  NewEmployee, 
  EmployeeUpdatePayload 
} from "@crm/shared/schemas/employee.schema";
import type { EmployeeFilter } from "@crm/shared/schemas/employee.schema";
import type { SortState } from "@/store/sort-store";
import type { StatsResponse } from "@crm/shared/schemas/stats.schema.js";

/**
 * Defines mandatory methods for any data source (API or Stub).
 * All implementations are expected to validate data against Zod schemas.
 */
export interface ApiClient {
  /**
   * Fetches employees and validates each record. 
   * Corrupted records should be filtered out.
   */
  getEmployees(
    filters?: EmployeeFilter, 
    sort?: SortState, 
    config?: AxiosRequestConfig
  ): Promise<Employee[]>;
  
  /**
   * Creates an employee and validates the server response.
   * Throws ZodError if response is invalid.
   */
  addEmployee(employee: NewEmployee): Promise<Employee>;
  
  /**
   * Removes an employee. No validation expected for empty responses.
   */
  deleteEmployee(id: string): Promise<void>;
  
  /**
   * Updates an employee and validates the patched response.
   * Throws ZodError if response is invalid.
   */
  updateEmployee(payload: EmployeeUpdatePayload): Promise<Employee>;

/**
   * Fetches pre-calculated statistics from the server.
   */
  getStatistics(): Promise<StatsResponse>;
}