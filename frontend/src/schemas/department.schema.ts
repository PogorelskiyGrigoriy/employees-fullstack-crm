/**
 * @module DepartmentSchema
 * Logic and validation for Department entities.
 * Includes schemas for forms, filters, and analytical data.
 */

import { z } from "zod";

/**
 * 1. Constant source of truth for department names
 */
export const DEPARTMENTS_LIST = [
  "QA", 
  "Development", 
  "Audit", 
  "Accounting", 
  "Management"
] as const;

/**
 * 2. Base department schema with custom error message
 */
export const departmentSchema = z.enum(DEPARTMENTS_LIST, "Select a valid department");

/**
 * 3. Filter-specific constants and schemas including "All" wildcard
 */
export const DEPARTMENT_FILTER_LIST = ["All", ...DEPARTMENTS_LIST] as const;
export const departmentFilterSchema = z.enum(DEPARTMENT_FILTER_LIST);

/**
 * 4. Inferred types for internal use and state management
 */
export type Department = z.infer<typeof departmentSchema>;
export type DepartmentFilterValue = z.infer<typeof departmentFilterSchema>;

/**
 * 5. Data model for department-based statistics/analytics
 */
export const departmentInfoSchema = z.object({
  department: departmentSchema,
  numEmployees: z.number(),
  avgSalary: z.number(),
  avgAge: z.number(),
});

export type DepartmentInfo = z.infer<typeof departmentInfoSchema>;