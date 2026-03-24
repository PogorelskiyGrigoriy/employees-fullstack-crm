/**
 * @module useAddEmployee
 * Mutation hook for creating a new employee record.
 */

import type { Employee, NewEmployee } from "@/schemas/employee.schema"; 
import { apiClient } from "@/services/ApiClientImplementation";
import { useEmployeesMutation } from "./useEmployeesMutation";

/**
 * Hook to add a new employee.
 * Sends data without ID, receives full Employee object from server.
 * Cache invalidation is handled automatically by useEmployeesMutation.
 */
export const useAddEmployee = () => {
  return useEmployeesMutation<NewEmployee, Employee>(
    (newEmp) => apiClient.addEmployee(newEmp)
  );
};