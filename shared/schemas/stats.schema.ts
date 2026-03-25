/**
 * @module StatsSchema
 * Shared data contract between Backend and Frontend.
 */

import { z } from "zod";
import { departmentSchema } from "./department.schema.js";

export const statsDataItemSchema = z.object({
  xValue: z.string(),
  yValue: z.number(),
  tooltipValue: z.string(),
});

export type StatsDataItem = z.infer<typeof statsDataItemSchema>;

/** Detailed analytics for a specific department */
export const departmentInfoSchema = z.object({
  department: departmentSchema,
  numEmployees: z.number(),
  avgSalary: z.number(),
  avgAge: z.number(),
});

export type DepartmentInfo = z.infer<typeof departmentInfoSchema>;

/** Updated full statistics response */
export const statsResponseSchema = z.object({
  salaryDistribution: z.array(z.any()), // Мы уже определили их выше
  ageDistribution: z.array(z.any()),
  departmentDistribution: z.array(z.any()),
  departmentAnalytics: z.array(departmentInfoSchema),
});

export type StatsResponse = z.infer<typeof statsResponseSchema>;