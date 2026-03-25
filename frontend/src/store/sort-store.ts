/**
 * @module useSortStore
 */

import { create } from "zustand";
import type { Employee } from "@crm/shared/schemas/employee.schema.js";
import type { SortOrder } from "@crm/shared/schemas/common.js";

export interface SortState {
  readonly key: keyof Employee | null; 
  readonly order: SortOrder;           
}

interface SortActions {
  toggleSort: (key: keyof Employee) => void;
  setOrder: (key: keyof Employee, order: SortOrder) => void;
  resetSort: () => void;
}

interface SortStore extends SortActions {
  readonly sort: SortState;
}

const initialState: SortState = {
  key: null,
  order: null,
};

const getNextOrder = (
  currentKey: keyof Employee | null, 
  nextKey: keyof Employee, 
  currentOrder: SortOrder
): SortOrder => {
  if (currentKey !== nextKey) return "asc";
  
  const transitions: Record<string, SortOrder> = {
    "null": "asc",
    "asc": "desc",
    "desc": null,
  };
  
  return transitions[String(currentOrder)] ?? "asc";
};

export const useSortStore = create<SortStore>((set) => ({
  sort: initialState,

  toggleSort: (key) =>
    set((state) => {
      const nextOrder = getNextOrder(state.sort.key, key, state.sort.order);
      return {
        sort: nextOrder ? { key, order: nextOrder } : initialState,
      };
    }),

  setOrder: (key, order) =>
    set({
      sort: order ? { key, order } : initialState,
    }),

  resetSort: () => set({ sort: initialState }),
}));