/**
 * @module Employees
 * Main container for the employee list. 
 * Orchestrates the switch between Mobile Card view and Desktop Table view.
 */

import { Box, Center, Spinner, Table, Text, VStack } from "@chakra-ui/react";
import { LuSearchX } from "react-icons/lu";

import { EmployeeCard } from "./EmployeeCard";
import { EmployeeRow } from "./EmployeeRow";
import { MobileSortActions } from "./MobileSortActions";
import { SortableColumn } from "./ui/SortableColumn";

import { useEmployees } from "@/services/hooks/useEmployees";
import { useUserRole } from "@/store/useAuthStore";

/**
 * Root component for the employee listing feature.
 * Manages fetching states and responsive layout transitions.
 */
export const Employees = () => {
  const { employees, isLoading, error, filteredCount, totalCount } = useEmployees();
  
  const userRole = useUserRole();
  const isAdmin = userRole === "ADMIN";

  // --- Loading State: Centered spinner for initial data fetch ---
  if (isLoading) return (
    <Center h="200px"><Spinner size="xl" color="blue.500" /></Center>
  );

  // --- Error State: User-friendly error message with technical details ---
  if (error) return (
    <Center h="200px">
      <VStack gap="2">
        <Text color="red.500" fontWeight="medium">
          Error loading employees
        </Text>
        <Text fontSize="xs" color="fg.muted">{error.message}</Text>
      </VStack>
    </Center>
  );

  // --- Empty State: Visual feedback when filters return no results ---
  if (filteredCount === 0) return (
    <Center 
      h="300px" 
      borderWidth="1px" 
      borderRadius="xl" 
      borderStyle="dashed" 
      bg="bg.subtle"
    >
      <VStack gap="3">
        <LuSearchX size="48px" style={{ opacity: 0.3 }} />
        <VStack gap="0">
          <Text fontWeight="bold" fontSize="lg">No employees found</Text>
          <Text color="fg.muted" fontSize="sm">Try adjusting your filters</Text>
        </VStack>
      </VStack>
    </Center>
  );

  return (
    <Box>
      {/* MOBILE VIEW: Rendered as a stack of touch-friendly cards */}
      <Box display={{ base: "block", md: "none" }} mb="4">
        <MobileSortActions />
        <VStack gap="3" align="stretch">
          {employees.map((empl) => (
            <EmployeeCard key={empl.id} employee={empl} isAdmin={isAdmin} />
          ))}
        </VStack>
      </Box>

      {/* DESKTOP VIEW: Structured data table for high density */}
      <Box 
        display={{ base: "none", md: "block" }}
        borderWidth="1px" 
        borderRadius="xl" 
        overflow="hidden" 
        boxShadow="sm" 
        bg="bg.panel"
      >
        <Table.Root size="md" variant="line" stickyHeader>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              {/* NOTE: SortableColumn acts as a Table.ColumnHeader internally.
                Layout props (width, display, textAlign) are passed directly.
              */}
              <SortableColumn field="fullName" width="full">
                Employee
              </SortableColumn>
              
              <Table.ColumnHeader fontWeight="bold" whiteSpace="nowrap">
                Department
              </Table.ColumnHeader>
              
              {/* FIXED: Direct 'display' prop prevents the "<th> inside <th>" error.
                This column remains hidden on medium screens for better readability.
              */}
              <SortableColumn 
                field="birthDate" 
                display={{ base: "none", lg: "table-cell" }}
              >
                Birth Date
              </SortableColumn>
              
              <SortableColumn field="salary" textAlign="end">
                Salary
              </SortableColumn>
              
              {isAdmin && (
                <Table.ColumnHeader textAlign="end" fontWeight="bold" whiteSpace="nowrap">
                  Actions
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {employees.map((empl) => (
              <EmployeeRow 
                key={empl.id} 
                employee={empl} 
                isAdmin={isAdmin} 
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* FOOTER STATS: Quick glance at the current filtering scope */}
      <Box p="3" mt="2">
        <Text fontSize="xs" color="fg.muted" textAlign="right" fontStyle="italic">
          Showing {filteredCount} of {totalCount} total employees
        </Text>
      </Box>
    </Box>
  );
};