/**
 * @module useFilters
 * Global state management for employee filtering logic.
 * Leverages Zod schema defaults to ensure state consistency.
 */

import { create } from "zustand";
import { employeeFilterSchema, type EmployeeFilter } from "@/schemas/employee.schema";

/**
 * Interface defining available actions for modifying the filter state.
 */
interface FiltersActions {
  /** Updates specific filter fields while preserving others */
  setFilters: (updates: Partial<EmployeeFilter>) => void;
  /** Reverts all filters back to their predefined default values */
  resetFilters: () => void;
}

/**
 * Combined interface for the Filters Store.
 */
interface FiltersStore extends FiltersActions {
  readonly filters: EmployeeFilter;
}

/** * Generate the initial state by parsing an empty object through the Zod schema.
 * This ensures that 'default()' values defined in the schema are automatically applied.
 */
const initialFilters = employeeFilterSchema.parse({});

/**
 * Zustand store for managing UI filter criteria.
 * Provides a single source of truth for salary ranges, age limits, and department selections.
 */
export const useFilters = create<FiltersStore>((set) => ({
  // Current state of all active filters
  filters: initialFilters,

  /**
   * Updates the filter state by merging existing values with the provided updates.
   * @param updates - A partial object containing the filter fields to change.
   */
  setFilters: (updates) => 
    set((state) => ({ 
      filters: { ...state.filters, ...updates } 
    })),

  /**
   * Resets the filter state back to the 'initialFilters' derived from the schema.
   */
  resetFilters: () => set({ filters: initialFilters }),
}));