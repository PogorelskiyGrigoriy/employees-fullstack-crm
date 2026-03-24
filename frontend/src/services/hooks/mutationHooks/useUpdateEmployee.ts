/**
 * @module useUpdateEmployee
 * Mutation hook for updating an existing employee record.
 */

import type { Employee, EmployeeUpdatePayload } from "@/schemas/employee.schema"; 
import { apiClient } from "@/services/ApiClientImplementation";
import { useEmployeesMutation } from "./useEmployeesMutation";

/**
 * Hook to update employee details.
 * Takes EmployeeUpdatePayload (ID + partial data) and returns updated Employee.
 * Automatically triggers cache invalidation for the employee list.
 */
export const useUpdateEmployee = () => {
  return useEmployeesMutation<EmployeeUpdatePayload, Employee>(
    (updater) => apiClient.updateEmployee(updater)
  );
};