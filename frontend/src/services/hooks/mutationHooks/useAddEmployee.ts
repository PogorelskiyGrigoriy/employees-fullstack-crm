/**
 * @module useAddEmployee
 */

import type { Employee, NewEmployee } from "@crm/shared/schemas/employee.schema.js"; 
import { apiClient } from "@/services/ApiClientImplementation";
import { useEmployeesMutation } from "./useEmployeesMutation";
import { toaster } from "@/components/ui/toaster-config";

export const useAddEmployee = () => {
  return useEmployeesMutation<NewEmployee, Employee>(
    (newEmp) => apiClient.addEmployee(newEmp),
    {
      onSuccess: () => {
        toaster.create({
          title: "Employee Added",
          description: "New record successfully created in the database",
          type: "success",
        });
      }
    }
  );
};