/**
 * @module Filters
 * A specialized form for filtering employee data.
 * Bridges global Zustand state with local validation using Zod and React Hook Form.
 */

import { VStack, HStack, Input, Button } from "@chakra-ui/react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field } from "@/components/ui/field";
import { DepartmentSelect } from "@/components/shared/DepartmentSelect";

import { useFilters } from "@/store/filters-store";
import { employeeFilterSchema, type EmployeeFilter } from "@/schemas/employee.schema";
import { EMPLOYEES_CONFIG } from "@/config/employees-config";

interface Props {
  /** Callback to close the filter overlay or modal upon application */
  readonly onClose: () => void;
}

/**
 * Filter form component providing inputs for department, salary range, and age.
 */
export const Filters = ({ onClose }: Props) => {
  // Syncing with global filter store
  const currentFilters = useFilters((state) => state.filters);
  const { setFilters, resetFilters } = useFilters();
  const { salary: salConf } = EMPLOYEES_CONFIG;

  // Derive initial/empty values directly from schema definitions
  const defaultValues = employeeFilterSchema.parse({});

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isValid } 
  } = useForm<EmployeeFilter>({
    mode: "onChange",
    resolver: zodResolver(employeeFilterSchema) as Resolver<EmployeeFilter>,
    defaultValues: currentFilters
  });

  /**
   * Updates the global store and triggers the close callback.
   */
  const handleApply = (data: EmployeeFilter) => {
    setFilters(data);
    onClose();
  };

  /**
   * Clears both global store and local form state.
   */
  const handleReset = () => {
    resetFilters();
    reset(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit(handleApply)}>
      <VStack gap="6" align="stretch" py="4">
        
        {/* Department filter using specialized 'filter' variant (includes "All") */}
        <DepartmentSelect 
          variant="filter"
          registration={register("department")} 
        />

        {/* Salary Range Inputs */}
        <Field 
          label={`Salary (${salConf.currency})`}
          invalid={!!errors.minSalary || !!errors.maxSalary}
          errorText={errors.minSalary?.message || errors.maxSalary?.message}
        >
          <HStack gap="3">
            <Input 
              type="number"
              placeholder="Min"
              {...register("minSalary", { valueAsNumber: true })} 
            />
            <Input 
              type="number"
              placeholder="Max"
              {...register("maxSalary", { valueAsNumber: true })} 
            />
          </HStack>
        </Field>

        {/* Age Range Inputs */}
        <Field 
          label="Age Range"
          invalid={!!errors.minAge || !!errors.maxAge}
          errorText={errors.minAge?.message || errors.maxAge?.message}
        >
          <HStack gap="3">
            <Input 
              type="number"
              placeholder="Min"
              {...register("minAge", { valueAsNumber: true })} 
            />
            <Input 
              type="number"
              placeholder="Max"
              {...register("maxAge", { valueAsNumber: true })} 
            />
          </HStack>
        </Field>

        {/* Action Buttons */}
        <HStack gap="4" mt="4">
          <Button 
            variant="ghost" 
            colorPalette="gray" 
            onClick={handleReset} 
            flex="1"
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            colorPalette="blue" 
            disabled={!isValid}
            flex="2"
          >
            Apply
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};