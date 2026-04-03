/**
 * @module EmployeeForm
 * Universal form for employee lifecycle management.
 * Refactored for Midnight Slate aesthetics and component consistency.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Input, Button, HStack } from "@chakra-ui/react";

import { Field } from "@/shared/ui/chakra/field";
import { DepartmentSelect } from "../shared/ui/molecules/DepartmentSelect";

import { 
  employeeSchema,
  newEmployeeSchema,
  type Employee, 
  type NewEmployee 
} from "@crm/shared/schemas/employee.schema.js";
import type { Department } from "@crm/shared/schemas/department.schema.js";
import { EMPLOYEES_CONFIG } from "@crm/shared/config/employees.config";

interface Props {
  onSubmit: (data: NewEmployee) => void;
  isLoading: boolean;
  employee?: Employee;
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

  useEffect(() => {
    reset(employee || DEFAULT_VALUES);
  }, [employee, reset]);

  const handleSecondaryAction = () => {
    isEditMode ? onCancel?.() : reset(DEFAULT_VALUES);
  };

  const isSubmitDisabled = !isValid || (isEditMode && !isDirty);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={6}>
        
        {/* 1. Full Name: Primary Focus */}
        <Field 
          label="Full Name" 
          invalid={!!errors.fullName} 
          errorText={errors.fullName?.message}
        >
          <Input 
            {...register("fullName")} 
            variant="subtle"
            placeholder="e.g. Jane Smith"
            _focus={{ borderColor: "brand.500" }}
          />
        </Field>

        {/* 2. Department: Shared Molecule */}
        <DepartmentSelect 
          variant="form"
          registration={register("department")}
          errorText={errors.department?.message}
        />

        {/* 3. Salary: With Contextual Helper */}
        <Field 
          label="Monthly Salary" 
          invalid={!!errors.salary} 
          errorText={errors.salary?.message}
          helperText={`Range: ${salary.currency}${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`}
        >
          <Input 
            type="number" 
            variant="subtle"
            {...register("salary", { valueAsNumber: true })} 
          />
        </Field>

        {/* 4. Birth Date: Immutable in Edit Mode */}
        <Field 
          label="Birth Date" 
          invalid={!!errors.birthDate} 
          errorText={errors.birthDate?.message}
          helperText={isEditMode ? "Date of birth is verified and locked" : `Min age: ${age.min} years`}
        >
          <Input 
            type="date" 
            variant="subtle"
            disabled={isEditMode}
            _disabled={{ opacity: 0.5, cursor: "not-allowed", bg: "bg.muted" }}
            {...register("birthDate")} 
          />
        </Field>

        {/* 5. Form Actions: Branded and Sized */}
        <HStack gap={4} mt={4}>
          <Button 
            variant="ghost" 
            onClick={handleSecondaryAction} 
            flex="1"
            disabled={isLoading}
          >
            {isEditMode ? "Cancel" : "Reset Form"}
          </Button>
          
          <Button 
            type="submit" 
            loading={isLoading} 
            disabled={isSubmitDisabled}
            colorPalette="brand"
            flex="1"
            shadow="md"
          >
            {isEditMode ? "Save Changes" : "Register Employee"}
          </Button>
        </HStack>
      </Stack>
    </form>
  );
};