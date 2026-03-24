/**
 * @module ApiClientImplementation
 * Concrete implementation of the ApiClient interface for a JSON-Server backend.
 * Features dual-mode validation: "Soft" for lists and "Strict" for mutations.
 */

import { api } from "@/api/axiosInstance";
import type { AxiosRequestConfig } from "axios";
import { ZodError } from "zod";

import { 
  employeeSchema, 
  type Employee, 
  type NewEmployee, 
  type EmployeeUpdatePayload 
} from "@/schemas/employee.schema";
import type { EmployeeFilter } from "@/schemas/employee.schema";

import type { SortState } from "@/store/sort-store";
import { getLimitDate } from "@/utils/dateUtils";
import { formatZodErrorToString } from "@/utils/errorHelpers";
import { toaster } from "@/components/ui/toaster-config";

import type { ApiClient } from "./ApiClient";

const ENDPOINTS = {
  EMPLOYEES: "/employees",
} as const;

/**
 * JSON-Server implementation with integrated Zod schema enforcement.
 */
class ApiClientJsonServer implements ApiClient {
  
  /**
   * Fetches employees and performs "Soft Validation".
   * Instead of failing the entire request, it filters out individual records 
   * that don't match the schema and notifies the user.
   */
  async getEmployees(
    filters?: EmployeeFilter, 
    sort?: SortState, 
    config?: AxiosRequestConfig
  ): Promise<Employee[]> {
    const params = this.buildParams(filters, sort, config?.params);

    const { data } = await api.get<unknown[]>(ENDPOINTS.EMPLOYEES, { 
      ...config, 
      params 
    });

    let corruptionCount = 0;

    const validatedData = data.reduce<Employee[]>((acc, item) => {
      const result = employeeSchema.safeParse(item);
      if (result.success) {
        acc.push(result.data);
      } else {
        corruptionCount++;
        console.error("[API Data Corruption]: Skipping invalid employee record", {
          id: (item as any)?.id,
          errors: result.error.format()
        });
      }
      return acc;
    }, []);

    // Notify user if some records were skipped due to integrity issues
    if (corruptionCount > 0) {
      toaster.create({
        title: "Data Integrity Notice",
        description: `Skipped ${corruptionCount} corrupted records. Contact support if this persists.`,
        type: "warning",
      });
    }
    
    return validatedData;
  }

  /**
   * Creates a new employee with "Strict Validation".
   * Throws an exception and triggers a toast if the server response is invalid.
   */
  async addEmployee(employee: NewEmployee): Promise<Employee> {
    try {
      const { data } = await api.post<unknown>(ENDPOINTS.EMPLOYEES, employee);
      return employeeSchema.parse(data);
    } catch (error) {
      this.handleZodError(error, "Failed to create employee due to data mismatch");
      throw error;
    }
  }

  /**
   * Deletes an employee record by ID.
   */
  async deleteEmployee(id: string): Promise<void> {
    await api.delete(`${ENDPOINTS.EMPLOYEES}/${id}`);
  }

  /**
   * Updates an existing employee using PATCH and performs "Strict Validation".
   */
  async updateEmployee({ id, changes }: EmployeeUpdatePayload): Promise<Employee> {
    try {
      const { data } = await api.patch<unknown>(`${ENDPOINTS.EMPLOYEES}/${id}`, changes);
      return employeeSchema.parse(data);
    } catch (error) {
      this.handleZodError(error, "Server returned invalid data after update");
      throw error;
    }
  }

  /**
   * Private helper to format and display Zod validation errors to the UI.
   */
  private handleZodError(error: unknown, contextMessage: string) {
    if (error instanceof ZodError) {
      const details = formatZodErrorToString(error);
      toaster.create({
        title: "Validation Error",
        description: `${contextMessage}: ${details}`,
        type: "error",
      });
    }
  }

  /**
   * Transforms UI filter and sort states into JSON-Server compatible query parameters.
   * Handles logic for range-based filtering (salary/age).
   */
  private buildParams(
    filters?: EmployeeFilter,
    sort?: SortState, 
    baseParams?: Record<string, any>
  ): Record<string, any> {
    const params: Record<string, any> = { ...baseParams };

    if (filters) {
      // Filter by department unless 'All' is selected
      if (filters.department && filters.department !== "All") {
        params.department = filters.department;
      }
      
      // Salary range filtering
      if (filters.minSalary !== undefined) params.salary_gte = filters.minSalary;
      if (filters.maxSalary !== undefined) params.salary_lte = filters.maxSalary;

      // Age range filtering (converted to birth dates)
      if (filters.minAge !== undefined) {
        params.birthDate_lte = getLimitDate(filters.minAge);
      }
      if (filters.maxAge !== undefined) {
        params.birthDate_gte = getLimitDate(filters.maxAge);
      }
    }

    // Apply sorting parameters
    if (sort?.key && sort?.order) {
      params._sort = sort.key;
      params._order = sort.order;
    }

    return params;
  }
}

/** Exporting a singleton instance for application-wide use */
export const apiClient: ApiClient = new ApiClientJsonServer();