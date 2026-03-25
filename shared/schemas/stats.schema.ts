/**
 * @module StatsSchema
 * Shared data contract between Backend and Frontend.
 */

import { z } from "zod";

export const statsDataItemSchema = z.object({
  xValue: z.string(),
  yValue: z.number(),
  tooltipValue: z.string(),
});

export type StatsDataItem = z.infer<typeof statsDataItemSchema>;

/** Structure of the full statistics API response */
export const statsResponseSchema = z.object({
  salaryDistribution: z.array(statsDataItemSchema),
  ageDistribution: z.array(statsDataItemSchema),
  departmentDistribution: z.array(statsDataItemSchema),
});

export type StatsResponse = z.infer<typeof statsResponseSchema>;