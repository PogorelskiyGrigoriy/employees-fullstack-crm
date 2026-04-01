/**
 * @module Filters
 * Final Clean Version: Refined search interface.
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

  const FilterLabel = ({ children }: { children: React.ReactNode }) => (
    <Text as="span" color="fg.emphasized" fontWeight="bold" fontSize="xs">
      {children}
    </Text>
  );

  return (
    <form onSubmit={handleSubmit(handleApply)}>
      <VStack gap={6} align="stretch" p={6}>
        <Text 
          fontSize="xs" 
          fontWeight="black" 
          color="brand.500" 
          textTransform="uppercase" 
          letterSpacing="widest"
        >
          Filter Directory
        </Text>

        <DepartmentSelect 
          variant="filter"
          label={<FilterLabel>Organization Unit</FilterLabel>}
          registration={register("department")} 
        />

        <Field 
          label={<FilterLabel>Salary Range ({salConf.currency})</FilterLabel>}
          invalid={!!errors.minSalary || !!errors.maxSalary}
          errorText={errors.minSalary?.message || errors.maxSalary?.message}
        >
          <HStack gap={3}>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Min"
              bg="bg.muted/50"
              {...register("minSalary", { valueAsNumber: true })} 
            />
            <Text color="fg.muted" fontSize="xs">to</Text>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Max"
              bg="bg.muted/50"
              {...register("maxSalary", { valueAsNumber: true })} 
            />
          </HStack>
        </Field>

        <Field 
          label={<FilterLabel>Age Demographics</FilterLabel>}
          invalid={!!errors.minAge || !!errors.maxAge}
          errorText={errors.minAge?.message || errors.maxAge?.message}
        >
          <HStack gap={3}>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Min"
              bg="bg.muted/50"
              {...register("minAge", { valueAsNumber: true })} 
            />
            <Text color="fg.muted" fontSize="xs">to</Text>
            <Input 
              variant="subtle"
              type="number"
              placeholder="Max"
              bg="bg.muted/50"
              {...register("maxAge", { valueAsNumber: true })} 
            />
          </HStack>
        </Field>

        <HStack gap={4} pt={2}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReset} 
            flex="1"
            color="fg.muted"
            _hover={{ bg: "whiteAlpha.100", color: "fg.emphasized" }}
          >
            Reset All
          </Button>
          <Button 
            type="submit" 
            size="sm"
            colorPalette="brand" 
            disabled={!isValid}
            flex="2"
          >
            Apply Filters
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};