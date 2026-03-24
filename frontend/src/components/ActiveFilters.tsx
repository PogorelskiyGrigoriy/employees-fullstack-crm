/**
 * @module ActiveFilters
 * Orchestrates the display of active filter tags.
 * Synchronizes with Zod schema defaults to identify modified search criteria.
 */

import { HStack, Text, Button } from "@chakra-ui/react";
import { Tag } from "./ui/tag";
import { useFilters } from "@/store/filters-store";
import { employeeFilterSchema } from "@/schemas/employee.schema";

/**
 * Component that renders removable tags for each active filter.
 */
export const ActiveFilters = () => {
  const { filters, setFilters, resetFilters } = useFilters();
  
  // Dynamic default values from schema to ensure consistency
  const defaults = employeeFilterSchema.parse({});

  /**
   * Definition of filter chips.
   * Logic for 'isActive' depends on comparing current state with schema defaults.
   */
  const activeChips = [
    {
      id: "dept",
      isActive: filters.department !== defaults.department,
      label: "Dept",
      value: filters.department,
      color: "blue",
      onClear: () => setFilters({ department: defaults.department }),
    },
    {
      id: "salary",
      isActive: filters.minSalary !== defaults.minSalary || filters.maxSalary !== defaults.maxSalary,
      label: "Salary",
      value: `${filters.minSalary.toLocaleString()} - ${filters.maxSalary.toLocaleString()}`,
      color: "green",
      onClear: () => setFilters({ minSalary: defaults.minSalary, maxSalary: defaults.maxSalary }),
    },
    {
      id: "age",
      isActive: filters.minAge !== defaults.minAge || filters.maxAge !== defaults.maxAge,
      label: "Age",
      value: `${filters.minAge} - ${filters.maxAge}`,
      color: "purple",
      onClear: () => setFilters({ minAge: defaults.minAge, maxAge: defaults.maxAge }),
    },
  ].filter(c => c.isActive);

  // Render nothing if no filters deviate from defaults
  if (activeChips.length === 0) return null;

  return (
    <HStack gap="2" wrap="wrap" mb="4">
      <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase">
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
        >
          <Text as="span" fontWeight="semibold" mr="1">
            {chip.label}:
          </Text>
          {chip.value}
        </Tag>
      ))}

      {/* Global reset button */}
      <Button variant="plain" size="xs" color="blue.500" onClick={resetFilters}>
        Clear all
      </Button>
    </HStack>
  );
};