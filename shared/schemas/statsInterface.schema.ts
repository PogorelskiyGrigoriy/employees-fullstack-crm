/**
 * @module StatsInterfaceSchema
 * Schemas and interfaces for visualization data structures.
 * Ensures consistent data shapes between analytical calculations and Chart components.
 */

import { z } from "zod";

/**
 * Schema for a single data point in a chart.
 * Used to validate calculation results or API responses before rendering.
 */
export const statsDataItemSchema = z.object({
  xValue: z.union([z.string(), z.number()]), // Represents the X-axis value (Label or Number)
  yValue: z.number(),                        // Represents the Y-axis value (Metric)
  tooltipValue: z.string(),                  // Formatted string for the chart tooltip
});

/** Inferred type for a single statistical data point */
export type StatsDataItem = z.infer<typeof statsDataItemSchema>;

/**
 * Interface for Statistics Chart components.
 * Standard React prop definition for charting UI.
 */
export interface StatsChartProps {
  readonly title: string;                   // Chart title displayed in the UI
  readonly data: readonly StatsDataItem[];  // Array of data points to render
  readonly dataKeyX?: keyof StatsDataItem;  // Optional key override for X-axis
  readonly dataKeyY?: keyof StatsDataItem;  // Optional key override for Y-axis
  readonly tooltipLabelKey?: keyof StatsDataItem; // Key used for tooltip identification
  readonly labelY?: string;                 // Display label for the Y-axis (e.g., "Quantity")
}