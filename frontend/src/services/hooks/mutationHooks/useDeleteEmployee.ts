/**
 * @module useDeleteEmployee
 * Specific mutation hook for removing an employee record.
 */

import { apiClient } from "@/services/ApiClientImplementation";
import { useEmployeesMutation } from "./useEmployeesMutation";
import { toaster } from "@/components/ui/toaster-config";

/**
 * Hook to delete an employee by ID.
 * Automatically invalidates the 'employees' query and shows a success toast.
 */
export const useDeleteEmployee = () => {
  return useEmployeesMutation<string, void>(
    (id) => apiClient.deleteEmployee(id),
    {
      onSuccess: () => {
        toaster.create({
          title: "Employee deleted",
          description: "The record has been successfully removed from the system",
          type: "success",
        });
      },
      onError: (error) => {
        toaster.create({
          title: "Error",
          description: error.message || "Failed to delete employee",
          type: "error",
        });
      }
    }
  );
};