/**
 * @module useSortStore
 * Global state management for employee data sorting.
 * Implements a cyclic state machine for predictable UI behavior.
 */

import { create } from "zustand";
import type { Employee } from "@/schemas/employee.schema";

/**
 * Domain Types for sorting logic.
 * 'null' represents a neutral state with no sorting applied.
 */
export type SortOrder = "asc" | "desc" | null;

/**
 * Represents the current sorting configuration.
 */
export interface SortState {
  readonly key: keyof Employee | null; // The employee property currently being sorted
  readonly order: SortOrder;           // The direction of the sort
}

/**
 * Interface defining actions for modifying the sort state.
 */
interface SortActions {
  /** Automatically cycles through sort directions for a given key */
  toggleSort: (key: keyof Employee) => void;
  /** Explicitly sets a specific sort key and direction */
  setOrder: (key: keyof Employee, order: SortOrder) => void;
  /** Clears all sorting parameters */
  resetSort: () => void;
}

/**
 * Combined interface for the Sort Store.
 */
interface SortStore extends SortActions {
  readonly sort: SortState;
}

/** Default state for a fresh, unsorted view */
const initialState: SortState = {
  key: null,
  order: null,
};

/**
 * State Machine Logic:
 * Defines the rotation sequence: None -> Ascending -> Descending -> None.
 * If a new key is selected, it starts with 'Ascending' by default.
 */
const getNextOrder = (
  currentKey: keyof Employee | null, 
  nextKey: keyof Employee, 
  currentOrder: SortOrder
): SortOrder => {
  // If clicking a different column, reset to ascending
  if (currentKey !== nextKey) return "asc";
  
  // Mapping transitions for predictable UI behavior on the same column
  const transitions: Record<string, SortOrder> = {
    "null": "asc",
    "asc": "desc",
    "desc": null,
  };
  
  return transitions[String(currentOrder)] ?? "asc";
};

/**
 * Zustand store for managing the sorting state of the employee list.
 * Centrally manages logic used by table headers and API requests.
 */
export const useSortStore = create<SortStore>((set) => ({
  // Initial sorting state
  sort: initialState,

  /**
   * Toggles the sort state for a specific key using cyclic logic.
   * If the cycle returns 'null', the entire sort state is reset to initial.
   */
  toggleSort: (key) =>
    set((state) => {
      const nextOrder = getNextOrder(state.sort.key, key, state.sort.order);
      
      return {
        sort: nextOrder ? { key, order: nextOrder } : initialState,
      };
    }),

  /**
   * Directly assigns a sorting configuration.
   * Used for programmatic sorting changes.
   */
  setOrder: (key, order) =>
    set({
      sort: order ? { key, order } : initialState,
    }),

  /**
   * Resets the store back to the neutral 'initialState'.
   */
  resetSort: () => set({ sort: initialState }),
}));