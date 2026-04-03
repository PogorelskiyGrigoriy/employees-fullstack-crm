/**
 * @module StatsUITypes
 * Specific interfaces for React Chart components.
 */

import type { StatsDataItem } from "@crm/shared/schemas/stats.schema.js";

/**
 * Interface for Statistics Chart components.
 * Standard React prop definition for charting UI.
 */
export interface StatsChartProps {
  readonly title: string;                   // Chart title displayed in the UI
  readonly data: readonly StatsDataItem[];  // Array of data points from API
  readonly dataKeyX?: keyof StatsDataItem;  // Key for X-axis (default: 'xValue')
  readonly dataKeyY?: keyof StatsDataItem;  // Key for Y-axis (default: 'yValue')
  readonly tooltipLabelKey?: keyof StatsDataItem; // Key for tooltips
  readonly labelY?: string;                 // Y-axis label (e.g., "Amount")
}