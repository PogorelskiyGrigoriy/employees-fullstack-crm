/**
 * @module EmployeesConfig
 * Global configuration for employee-related business rules, 
 * grouping logic, and UI constraints.
 */

import { DEPARTMENTS_LIST, type Department } from "@/schemas/department.schema";

/**
 * Configuration for numeric ranges used in grouping and filtering (e.g., Salary, Age).
 */
export interface GroupingConfig {
  readonly min: number;      // Minimum allowed value
  readonly max: number;      // Maximum allowed value
  readonly interval: number; // Step interval for sliders or groupings
  readonly unit?: string;    // Display unit (e.g., 'k')
  readonly currency?: string; // Currency symbol (e.g., '$')
  readonly label: string;    // Display label for the UI
}

/**
 * Main application configuration for employee data.
 */
interface EmployeesConfig {
  readonly salary: GroupingConfig;
  readonly age: GroupingConfig;
  readonly departments: readonly Department[]; 
}

/**
 * Global constant providing business rules and UI limits.
 * Uses 'as const' to ensure deep immutability.
 */
export const EMPLOYEES_CONFIG: EmployeesConfig = {
  salary: {
    min: 5000,
    max: 50000,
    interval: 5000,
    unit: 'k',
    currency: '$',
    label: 'Salary'
  },
  age: {
    min: 20,
    max: 65,
    interval: 5,
    label: 'Age'
  },
  // List of available departments from schema
  departments: DEPARTMENTS_LIST,
} as const;