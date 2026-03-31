/**
 * @module Employees
 * The central orchestrator for the employee directory.
 * Refactored using DataStateWrapper for lifecycle management 
 * and AppPanel for consistent desktop containment.
 */

import { Box, Table, Text, VStack } from "@chakra-ui/react";
import { EmployeeCard } from "./EmployeeCard";
import { EmployeeRow } from "./EmployeeRow";
import { MobileSortActions } from "./MobileSortActions";
import { SortableColumn } from "./shared/molecules/SortableColumn";

import { useEmployees } from "@/services/hooks/use-employees";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { RBACGuard } from "@/components/shared/organisms/RBACGuard";

export const Employees = () => {
  const { 
    employees, 
    isLoading, 
    error, 
    filteredCount, 
    totalCount,
    refetch
  } = useEmployees();

  return (
    <DataStateWrapper
      isLoading={isLoading}
      isError={!!error}
      error={error}
      isEmpty={filteredCount === 0}
      emptyMessage="No employees found"
      emptyDescription="Try adjusting your filters or search terms to find what you're looking for."
      onRetry={refetch}
    >
      <Box>
        {/* 1. MOBILE VIEW: Stack of Cards */}
        <Box display={{ base: "block", md: "none" }} mb={6}>
          <MobileSortActions />
          <VStack gap={4} align="stretch">
            {employees.map((empl) => (
              <EmployeeCard key={empl.id} employee={empl} />
            ))}
          </VStack>
        </Box>

        {/* 2. DESKTOP VIEW: Structured Table in AppPanel */}
        <AppPanel 
          display={{ base: "none", md: "block" }}
          p={0} // Table fills the panel completely
          overflow="hidden"
        >
          <Table.Root size="md" variant="line" stickyHeader>
            <Table.Header bg="bg.muted">
              <Table.Row>
                <SortableColumn field="fullName" width="full">
                  Employee
                </SortableColumn>
                <Table.ColumnHeader fontWeight="bold">
                  Department
                </Table.ColumnHeader>
                <SortableColumn 
                  field="birthDate" 
                  display={{ base: "none", lg: "table-cell" }}
                >
                  Birth Date
                </SortableColumn>
                <SortableColumn field="salary" textAlign="end">
                  Salary
                </SortableColumn>
                
                {/* Standardized RBAC Protection for the Header Cell */}
                <RBACGuard roles={["ADMIN"]}>
                  <Table.ColumnHeader textAlign="end" fontWeight="bold">
                    Actions
                  </Table.ColumnHeader>
                </RBACGuard>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {employees.map((empl) => (
                <EmployeeRow key={empl.id} employee={empl} />
              ))}
            </Table.Body>
          </Table.Root>
        </AppPanel>

        {/* 3. FOOTER: Result counts */}
        <Box p={4}>
          <Text 
            fontSize="xs" 
            color="fg.muted" 
            textAlign="right" 
            fontWeight="medium"
            letterSpacing="tight"
          >
            Showing <Text as="span" color="fg.emphasized" fontWeight="bold">{filteredCount}</Text> of {totalCount} total employees
          </Text>
        </Box>
      </Box>
    </DataStateWrapper>
  );
};