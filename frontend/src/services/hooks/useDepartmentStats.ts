/**
 * @module useDepartmentStats
 * Custom hook that aggregates the CURRENTLY FILTERED employee dataset 
 * into department-level analytical statistics.
 */

import { useMemo } from "react";
import { groupBy, meanBy } from "lodash";
import { useEmployees } from "./useEmployees";
import { EMPLOYEES_CONFIG } from "@/config/employees-config";
import type { DepartmentInfo } from "@/schemas/department.schema";
import { calculateAge } from "@/utils/dateUtils";
import type { Employee } from "@/schemas/employee.schema";

/**
 * Hook to calculate and provide department analytics.
 * Automatically recalculates whenever the filtered employee list changes.
 */
export const useDepartmentStats = () => {
  // Data Source: reacts to global filter changes via the underlying useEmployees hook
  const { employees, isLoading, error } = useEmployees();

  /**
   * Memoized calculation of statistics per department.
   * Ensures UI performance by avoiding unnecessary recalculations on every render.
   */
  const departmentsInfo = useMemo(() => {
    // Optimization: Return zero-initialized stats for all departments if no data matches active filters
    if (!employees.length) {
      return EMPLOYEES_CONFIG.departments.map(dept => ({
        department: dept,
        numEmployees: 0,
        avgSalary: 0,
        avgAge: 0
      }));
    }

    // Group employees by their department ID/name
    const grouped = groupBy(employees, (e: Employee) => e.department);

    // Map through the master department list to ensure all departments are represented in the results
    return EMPLOYEES_CONFIG.departments.map((dept): DepartmentInfo => {
      const deptEmployees = grouped[dept] || [];
      const count = deptEmployees.length;

      return {
        department: dept,
        numEmployees: count,
        // Calculate rounded average salary for the group
        avgSalary: count > 0 
          ? Math.round(meanBy(deptEmployees, (e: Employee) => e.salary)) 
          : 0,
        // Calculate rounded average age based on birth dates
        avgAge: count > 0 
          ? Math.round(meanBy(deptEmployees, (e: Employee) => calculateAge(e.birthDate)))
          : 0
      };
    });
  }, [employees]);

  return { departmentsInfo, isLoading, error };
};