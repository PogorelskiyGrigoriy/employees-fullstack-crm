/**
 * @module Filters
 * A refined search interface for the employee directory.
 * Refactored for Midnight Slate aesthetics using standardized molecules.
 */

import { VStack, HStack, Input, Button, Text } from "@chakra-ui/react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field } from "@/components/ui/field";
import { DepartmentSelect } from "@/components/shared/molecules/DepartmentSelect";

import { useFilters } from "@/store/filters-store";
import { employeeFilterSchema, type EmployeeFilter } from "@crm/shared/schemas/employee.schema.js";
import { EMPLOYEES_CONFIG } from "@crm/shared/config/employees.config";

interface Props {
  readonly onClose: () => void;
}

export const Filters = ({ onClose }: Props) => {
  const currentFilters = useFilters((state) => state.filters);
  const { setFilters, resetFilters } = useFilters();
  const { salary: salConf } = EMPLOYEES_CONFIG;

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

  const handleApply = (data: EmployeeFilter) => {
    setFilters(data);
    onClose();
  };

  const handleReset = () => {
    resetFilters();
    reset(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit(handleApply)}>
      <VStack gap={6} align="stretch" py={2}>
        
        {/* 1. Department: Uses 'filter' variant which includes "All" option */}
        <DepartmentSelect 
          variant="filter"
          label="Organization Unit"
          registration={register("department")} 
        />

        {/* 2. Salary Range: Subtle paired inputs */}
        <Field 
          label={`Salary Range (${salConf.currency})`}
          invalid={!!errors.minSalary || !!errors.maxSalary}
          errorText={errors.minSalary?.message || errors.maxSalary?.message}
        >
          <HStack gap={3}>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Min"
              {...register("minSalary", { valueAsNumber: true })} 
            />
            <Text color="fg.muted" fontSize="sm">to</Text>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Max"
              {...register("maxSalary", { valueAsNumber: true })} 
            />
          </HStack>
        </Field>

        {/* 3. Age Range: Subtle paired inputs */}
        <Field 
          label="Age Demographics"
          invalid={!!errors.minAge || !!errors.maxAge}
          errorText={errors.minAge?.message || errors.maxAge?.message}
        >
          <HStack gap={3}>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Min"
              {...register("minAge", { valueAsNumber: true })} 
            />
            <Text color="fg.muted" fontSize="sm">to</Text>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Max"
              {...register("maxAge", { valueAsNumber: true })} 
            />
          </HStack>
        </Field>

        {/* 4. Action Bar: Standardized branded buttons */}
        <HStack gap={4} mt={6}>
          <Button 
            variant="ghost" 
            onClick={handleReset} 
            flex="1"
            _hover={{ bg: "whiteAlpha.100" }}
          >
            Reset All
          </Button>
          <Button 
            type="submit" 
            colorPalette="brand" 
            disabled={!isValid}
            flex="2"
            shadow="md"
          >
            Apply Filters
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};