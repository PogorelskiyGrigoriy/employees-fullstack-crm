/**
 * @module DepartmentSelect
 * Final Clean Version: High-contrast NativeSelect.
 */

import { NativeSelect } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { 
  DEPARTMENTS_LIST, 
  DEPARTMENT_FILTER_LIST 
} from "@crm/shared/schemas/department.schema.js";

interface DepartmentSelectProps {
  registration: any;
  errorText?: string;
  variant?: "form" | "filter";
  label?: React.ReactNode;
}

export const DepartmentSelect = ({ 
  registration, 
  errorText, 
  variant = "form",
  label = "Department"
}: DepartmentSelectProps) => {
  const isFilter = variant === "filter";
  const options = isFilter ? DEPARTMENT_FILTER_LIST : DEPARTMENTS_LIST;

  return (
    <Field label={label} invalid={!!errorText} errorText={errorText}>
      <NativeSelect.Root size="md">
        <NativeSelect.Field 
          {...registration} 
          variant="outline"
          bg="bg.panel"
          color="fg.emphasized"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.emphasized"
          _focus={{ 
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)" 
          }}
          css={{ colorScheme: "dark" }}
        >
          {!isFilter && <option value="">Select Department</option>}
          {options.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </NativeSelect.Field>
        
        <NativeSelect.Indicator color="brand.500" /> 
      </NativeSelect.Root>
    </Field>
  );
};