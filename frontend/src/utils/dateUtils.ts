/**
 * @module dateUtils
 * Pure utility functions for date manipulation and formatting.
 */

import { 
  differenceInYears, 
  parseISO, 
  format, 
  isValid, 
  subYears, 
  startOfToday 
} from "date-fns";
import type { GroupingConfig } from "@/config/employees-config";

const DATE_FORMATS = {
  DISPLAY: "dd.MM.yyyy",
  API: "yyyy-MM-dd", 
} as const;

/**
 * Calculates full years between today and the given ISO date string.
 */
export const calculateAge = (birthDate: string | null | undefined): number => {
  if (!birthDate) return 0;
  const birth = parseISO(birthDate);
  return isValid(birth) ? differenceInYears(startOfToday(), birth) : 0;
};

/**
 * Formats ISO string or Date object for UI display.
 */
export const formatDateDisplay = (date: string | Date): string => {
  const d = typeof date === "string" ? parseISO(date) : date;
  return isValid(d) ? format(d, DATE_FORMATS.DISPLAY) : "—";
};

/**
 * Converts numeric age back to an ISO date string (X years ago).
 * Useful for setting 'min' or 'max' attributes in HTML date inputs.
 */
export const ageToDate = (age: number): string => {
  const targetDate = subYears(startOfToday(), age);
  return format(targetDate, DATE_FORMATS.API);
};

/**
 * Determines the age group label based on a value and grouping config.
 * Example: 27 with interval 5 and min 20 -> "25-29"
 */
export const getAgeGroupLabel = (age: number, config: GroupingConfig): string => {
  const { min, interval } = config;
  if (age < min) return `< ${min}`;
  
  const bucketStart = Math.floor((age - min) / interval) * interval + min;
  const bucketEnd = bucketStart + interval - 1;
  
  return `${bucketStart}-${bucketEnd}`;
};

export const getLimitDate = (yearsBack: number): string => ageToDate(yearsBack);