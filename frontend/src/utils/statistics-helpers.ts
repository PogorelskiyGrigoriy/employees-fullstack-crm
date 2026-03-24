/**
 * @module statistics-helpers
 * Utilities for analytical data processing.
 * Features a generic binning algorithm for distributing records into fixed-interval ranges.
 */

import { range, countBy } from "lodash";
import type { GroupingConfig } from "@/config/employees-config";
import type { StatsDataItem } from "@/schemas/statsInterface.schema";

/**
 * Distributes a collection of items into numeric bins (ranges).
 * Commonly used for creating histograms (e.g., Salary distribution, Age groups).
 * * @template T - The type of items in the collection.
 * @param items - The source array of data objects.
 * @param config - Configuration for min, max, and interval size.
 * @param valueExtractor - Function to pull the numeric value for binning from an item.
 * @param formatters - Object containing functions to format X-axis labels and tooltips.
 * @returns An array of StatsDataItem ready for chart rendering.
 */
export const getBinnedData = <T>(
  items: readonly T[],
  config: GroupingConfig, 
  valueExtractor: (item: T) => number,
  formatters: {
    xKey: (v: number) => string
    tooltip: (v: number, isLast: boolean) => string
  }
): StatsDataItem[] => {
  const { min, max, interval } = config;

  // Defensive check to prevent infinite loops in range generation
  if (interval <= 0) return [];

  /**
   * 1. Frequency Distribution Logic
   * Uses lodash countBy to aggregate items into their respective bins.
   */
  const stats = countBy(items, (item) => {
    const val = valueExtractor(item);
    
    // Clamp values to ensure they fall within the [min, max - 1] range
    const effectiveVal = Math.min(Math.max(val, min), max - 1);
    
    // Calculate the starting point of the bin for the current value
    const offset = effectiveVal - min;
    const binStart = Math.floor(offset / interval) * interval + min;
    return binStart;
  });

  /**
   * 2. Range Mapping
   * Generates a complete sequence of bins and populates them with aggregated data.
   * Ensures that empty bins are represented with a yValue of 0.
   */
  return range(min, max, interval).map((v) => {
    const isLast = v + interval >= max;
    
    return {
      xValue: formatters.xKey(v),
      // lodash countBy keys are strings, but JS object access handles number coercion automatically
      yValue: stats[v] || 0, 
      tooltipValue: formatters.tooltip(v, isLast),
    };
  });
};