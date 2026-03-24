/**
 * @module useAnalytics
 * Prepares chart-ready data structures from validated employee records.
 * Acts as a bridge between raw data and visualization components.
 */

import { useMemo } from "react";
import { useEmployees } from "./useEmployees";
import { EMPLOYEES_CONFIG } from "@/config/employees-config";
import { getBinnedData } from "@/utils/statistics-helpers";
import { calculateAge } from "@/utils/dateUtils";
import { countBy } from "lodash";
import type { StatsDataItem } from "@/schemas/statsInterface.schema";
import type { Employee } from "@/schemas/employee.schema";

/**
 * Custom hook to transform employee data into specific chart formats.
 * @param type - The dimension of analysis: 'age', 'salary', or 'department'.
 * @returns An array of data points optimized for the StatsChart component.
 */
export const useAnalytics = (type: 'age' | 'salary' | 'department'): StatsDataItem[] => {
  // Access the current filtered dataset
  const { employees } = useEmployees();

  return useMemo(() => {
    // If no data is available (loading or all records filtered out), return empty set
    if (!employees || employees.length === 0) return [];

    switch (type) {
      /**
       * CASE: Salary Distribution
       * Groups employees into financial brackets defined in the global config.
       */
      case 'salary': {
        const config = EMPLOYEES_CONFIG.salary;
        
        return getBinnedData<Employee>(employees, config, (e) => e.salary, {
          // Format X-axis labels (e.g., "5k", "10k")
          xKey: (v) => `${v / 1000}${config.unit}`,
          // Provide descriptive tooltips with currency formatting
          tooltip: (v, isLast) => {
            const end = isLast ? config.max : v + config.interval - 1;
            return `${config.currency}${v.toLocaleString()} — ${config.currency}${end.toLocaleString()}`;
          }
        });
      }

      /**
       * CASE: Age Distribution
       * Groups employees into age bins (e.g., 20-24, 25-29) using birth date calculations.
       */
      case 'age': {
        const config = EMPLOYEES_CONFIG.age;
        return getBinnedData<Employee>(
          employees, 
          config, 
          (e) => calculateAge(e.birthDate), 
          {
            xKey: (v) => {
              const isLast = v + config.interval >= config.max;
              const endValue = isLast ? config.max : v + config.interval - 1;
              return `${v}-${endValue}`;
            },
            tooltip: (v, isLast) => {
              const endValue = isLast ? config.max : v + config.interval - 1;
              return `Age: ${v} — ${endValue}`;
            }
          }
        );
      }

      /**
       * CASE: Department Breakdown
       * Performs a simple count of employees across all registered departments.
       */
      case 'department': {
        const stats = countBy(employees, 'department');
        return EMPLOYEES_CONFIG.departments.map(dept => ({
          xValue: dept,
          yValue: stats[dept] || 0,
          tooltipValue: `Department: ${dept} (${stats[dept] || 0} employees)`
        }));
      }

      default:
        return [];
    }
  }, [employees, type]);
};