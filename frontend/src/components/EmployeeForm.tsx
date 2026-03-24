/**
 * @module EmployeeForm
 * Universal form for creating and updating employee records.
 * Optimized with dynamic Zod schema selection and state tracking (isDirty/isValid).
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Input, Button, HStack } from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { DepartmentSelect } from "@/components/shared/DepartmentSelect";

import { 
  employeeSchema,
  newEmployeeSchema,
  type Employee, 
  type NewEmployee 
} from "@/schemas/employee.schema";
import type { Department } from "@/schemas/department.schema";
import { EMPLOYEES_CONFIG } from "@/config/employees-config";

interface Props {
  /** Callback triggered on valid form submission */
  onSubmit: (data: NewEmployee) => void;
  /** Submission status from parent mutation hook */
  isLoading: boolean;
  /** If provided, switches form to 'Edit' mode */
  employee?: Employee;
  /** Optional callback for handling cancellation */
  onCancel?: () => void;
}

const DEFAULT_VALUES: NewEmployee = {
  fullName: "",
  department: "" as Department,
  salary: EMPLOYEES_CONFIG.salary.min,
  birthDate: "",
};

export const EmployeeForm = ({ onSubmit, isLoading, employee, onCancel }: Props) => {
  const isEditMode = !!employee;
  const { salary, age } = EMPLOYEES_CONFIG;
  
  /** * Dynamic Schema selection.
   * Edit mode requires ID validation, whereas creation mode focuses on new fields.
   */
  const schema = isEditMode ? employeeSchema : newEmployeeSchema;

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isValid, isDirty } 
  } = useForm<NewEmployee>({
    mode: "onChange",
    resolver: zodResolver(schema) as any, 
    defaultValues: (employee || DEFAULT_VALUES) as NewEmployee
  });

  /**
   * Syncs internal form state with props.
   * Crucial when the drawer is reused for different employees without unmounting.
   */
  useEffect(() => {
    reset(employee || DEFAULT_VALUES);
  }, [employee, reset]);

  /**
   * Defines behavior for the secondary button (Cancel vs Clear).
   */
  const handleSecondaryAction = () => {
    if (isEditMode) {
      onCancel?.();
    } else {
      reset(DEFAULT_VALUES);
    }
  };

  /**
   * Validation logic:
   * 1. Block if invalid based on Zod rules.
   * 2. Block if in edit mode but no data was changed (optimization).
   */
  const isSubmitDisabled = !isValid || (isEditMode && !isDirty);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="5">
        
        {/* Full Name Input */}
        <Field 
          label="Full Name" 
          invalid={!!errors.fullName} 
          errorText={errors.fullName?.message}
        >
          <Input 
            {...register("fullName")} 
            placeholder="e.g. Jane Smith"
          />
        </Field>

        {/* Shared Department Select Component */}
        <DepartmentSelect 
          variant="form"
          registration={register("department")}
          errorText={errors.department?.message}
        />

        {/* Salary Input with automatic numeric coercion */}
        <Field 
          label={`Salary (${salary.currency}${salary.min} - ${salary.max})`} 
          invalid={!!errors.salary} 
          errorText={errors.salary?.message}
        >
          <Input 
            type="number" 
            {...register("salary", { valueAsNumber: true })} 
          />
        </Field>

        {/* Birth Date Input - Disabled in Edit Mode by business logic */}
        <Field 
          label={`Birth Date (Age ${age.min}+)`} 
          invalid={!!errors.birthDate} 
          errorText={errors.birthDate?.message}
          helperText={isEditMode ? "Birth date cannot be changed" : undefined}
        >
          <Input 
            type="date" 
            disabled={isEditMode}
            opacity={isEditMode ? 0.6 : 1}
            {...register("birthDate")} 
          />
        </Field>

        {/* Form Action Bar */}
        <HStack gap="4" mt="4">
          <Button 
            variant="ghost" 
            onClick={handleSecondaryAction} 
            flex="1"
            disabled={isLoading}
          >
            {isEditMode ? "Cancel" : "Clear"}
          </Button>
          <Button 
            type="submit" 
            loading={isLoading} 
            disabled={isSubmitDisabled}
            colorPalette="blue"
            flex="1"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </HStack>
      </Stack>
    </form>
  );
};