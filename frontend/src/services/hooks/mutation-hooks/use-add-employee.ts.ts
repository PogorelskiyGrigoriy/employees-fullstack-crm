/**
 * @module useAddEmployee
 */

import type { Employee, NewEmployee } from "@crm/shared/schemas/employee.schema.js"; 
import { apiClient } from "@/services/api-client.implementation";
import { useEmployeesMutation } from "./use-employee-mutation";
import { toaster } from "@/shared/ui/toaster-config";

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