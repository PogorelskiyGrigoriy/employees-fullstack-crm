/**
 * @module DepartmentSelect
 * A versatile selection component designed for both form inputs and search filters.
 * Synchronizes with centralized schema constants to ensure data consistency.
 */

import { NativeSelectField, NativeSelectRoot } from "@/components/ui/native-select";
import { Field } from "@/components/ui/field";
import type { UseFormRegisterReturn } from "react-hook-form";
import { DEPARTMENTS_LIST, DEPARTMENT_FILTER_LIST } from "@/schemas/department.schema";

interface DepartmentSelectProps {
  /** 'form' for data entry, 'filter' for search queries */
  variant?: "form" | "filter";
  /** React Hook Form registration object */
  registration: UseFormRegisterReturn;
  errorText?: string;
  helperText?: string;
}

/**
 * Reusable Select component that dynamically adjusts its options and labels.
 */
export const DepartmentSelect = ({ 
  variant = "form", 
  registration, 
  errorText,
  helperText 
}: DepartmentSelectProps) => {
  const isFilter = variant === "filter";
  
  // Use specific lists: Filter mode includes "All", Form mode requires specific departments
  const options = isFilter ? DEPARTMENT_FILTER_LIST : DEPARTMENTS_LIST;
  const placeholder = isFilter ? undefined : "Select department...";

  return (
    <Field 
      label={!isFilter ? "Department" : undefined} // Labels are usually hidden in filter bars
      invalid={!!errorText} 
      errorText={errorText}
      helperText={helperText}
    >
      <NativeSelectRoot>
        <NativeSelectField {...registration}>
          {/* Form mode requires a placeholder for empty selection */}
          {!isFilter && <option value="">{placeholder}</option>}
          
          {options.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </Field>
  );
};