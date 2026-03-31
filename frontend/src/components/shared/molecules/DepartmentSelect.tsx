/**
 * @module DepartmentSelect
 * Reusable select component for departments.
 * Fixed to use the correct DEPARTMENTS_LIST and DEPARTMENT_FILTER_LIST constants.
 */

import { NativeSelect } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { 
  DEPARTMENTS_LIST, 
  DEPARTMENT_FILTER_LIST 
} from "@crm/shared/schemas/department.schema.js";

interface DepartmentSelectProps {
  /** Registration object from react-hook-form */
  registration: any;
  /** Error message from formState.errors */
  errorText?: string;
  /** 'form' for new/edit employee, 'filter' for the search drawer */
  variant?: "form" | "filter";
  /** Custom label (defaults to "Department") */
  label?: string;
}

export const DepartmentSelect = ({ 
  registration, 
  errorText, 
  variant = "form",
  label = "Department"
}: DepartmentSelectProps) => {
  const isFilter = variant === "filter";
  
  // Decide which list to use based on the context
  const options = isFilter ? DEPARTMENT_FILTER_LIST : DEPARTMENTS_LIST;

  return (
    <Field 
      label={isFilter ? undefined : label} 
      invalid={!!errorText} 
      errorText={errorText}
    >
      <NativeSelect.Root>
        <NativeSelect.Field 
          {...registration} 
          variant="subtle"
          bg={isFilter ? "transparent" : "bg.muted"}
          _focus={{ borderColor: "brand.500" }}
        >
          {/* If it's not a filter, we might want an empty placeholder first */}
          {!isFilter && <option value="">Select Department</option>}
          
          {options.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </NativeSelect.Field>
      </NativeSelect.Root>
    </Field>
  );
};