/**
 * @module ActiveFilters
 * Displays interactive tags for currently applied directory filters.
 * Refactored for Midnight Slate aesthetics and semantic tokens.
 */

import { HStack, Text, Button } from "@chakra-ui/react";
import { Tag } from "./ui/tag";
import { useFilters } from "@/store/filters-store";
import { employeeFilterSchema } from "@crm/shared/schemas/employee.schema.js";
import { EMPLOYEES_CONFIG } from "@crm/shared/config/employees.config";

export const ActiveFilters = () => {
  const { filters, setFilters, resetFilters } = useFilters();
  
  const defaults = employeeFilterSchema.parse({});

  /**
   * Logic: Compare current store values with schema defaults.
   * Color Palettes are chosen to be visible but professional on dark slate.
   */
  const activeChips = [
    {
      id: "dept",
      isActive: filters.department !== defaults.department,
      label: "Dept",
      value: filters.department,
      color: "brand", // Indigo/Brand identity
      onClear: () => setFilters({ department: defaults.department }),
    },
    {
      id: "salary",
      isActive: filters.minSalary !== defaults.minSalary || filters.maxSalary !== defaults.maxSalary,
      label: "Salary",
      value: `${EMPLOYEES_CONFIG.salary.currency}${filters.minSalary.toLocaleString()} - ${filters.maxSalary.toLocaleString()}`,
      color: "teal",
      onClear: () => setFilters({ minSalary: defaults.minSalary, maxSalary: defaults.maxSalary }),
    },
    {
      id: "age",
      isActive: filters.minAge !== defaults.minAge || filters.maxAge !== defaults.maxAge,
      label: "Age",
      value: `${filters.minAge} - ${filters.maxAge}`,
      color: "orange",
      onClear: () => setFilters({ minAge: defaults.minAge, maxAge: defaults.maxAge }),
    },
  ].filter(c => c.isActive);

  if (activeChips.length === 0) return null;

  return (
    <HStack gap="3" wrap="wrap" mb="4">
      <Text 
        fontSize="xs" 
        fontWeight="black" 
        color="fg.muted" 
        textTransform="uppercase"
        letterSpacing="widest"
      >
        Active Filters:
      </Text>

      {activeChips.map((chip) => (
        <Tag
          key={chip.id}
          colorPalette={chip.color}
          variant="subtle"
          size="lg"
          closable
          onClose={chip.onClear}
          borderRadius="full"
          px={3}
        >
          <Text as="span" opacity={0.8} fontWeight="medium" mr="1">
            {chip.label}:
          </Text>
          <Text as="span" fontWeight="bold">
            {chip.value}
          </Text>
        </Tag>
      ))}

      {/* Global Reset using Brand Token */}
      <Button 
        variant="plain" 
        size="xs" 
        color="brand.500" 
        fontWeight="bold"
        onClick={resetFilters}
        _hover={{ color: "brand.400", textDecoration: "underline" }}
        transition="all 0.2s"
      >
        Clear all
      </Button>
    </HStack>
  );
};