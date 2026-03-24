/**
 * @module EmployeeRow
 * Displays a single employee record as a table row.
 * Optimized for high-density desktop views with responsive column visibility.
 */

import { Table, HStack, VStack, Text } from "@chakra-ui/react";
import { CurrencyText, DateText, EmployeeIdentity, DeptBadge } from "./ui/DataDisplay";
import { DeleteEmployeeAction } from "./DeleteEmployeeAction";
import { EditEmployeeAction } from "./EditEmployeeAction";
import { calculateAge } from "@/utils/dateUtils";
import type { Employee } from "@/schemas/employee.schema";

interface EmployeeRowProps {
  readonly employee: Employee;
  readonly isAdmin: boolean;
}

export const EmployeeRow = ({ employee: empl, isAdmin }: EmployeeRowProps) => {
  const age = calculateAge(empl.birthDate);

  return (
    <Table.Row 
      _hover={{ bg: "bg.muted/50" }} 
      transition="background-color 0.2s"
    >
      {/* 1. Identity: Primary information (Name + Avatar) */}
      <Table.Cell width="full">
        <EmployeeIdentity 
          name={empl.fullName} 
          avatar={empl.avatar ?? undefined} 
        />
      </Table.Cell>
      
      {/* 2. Organizational unit */}
      <Table.Cell whiteSpace="nowrap">
        <DeptBadge>{empl.department}</DeptBadge>
      </Table.Cell>
      
      {/* 3. Temporal Data: Hidden on smaller screens to prevent horizontal overflow */}
      <Table.Cell display={{ base: "none", lg: "table-cell" }} whiteSpace="nowrap">
        <VStack align="start" gap="0">
          <DateText dateString={empl.birthDate} />
          <Text fontSize="xs" color="fg.muted">
            {age} years old
          </Text>
        </VStack>
      </Table.Cell>
      
      {/* 4. Financial Data: Right-aligned for easier numeric comparison */}
      <Table.Cell textAlign="end" whiteSpace="nowrap">
        <CurrencyText value={empl.salary} />
      </Table.Cell>
      
      {/* 5. Management Actions: Conditionally rendered based on role */}
      {isAdmin && (
        <Table.Cell textAlign="end" whiteSpace="nowrap">
          <HStack gap="1" justifyContent="flex-end">
            <EditEmployeeAction employee={empl} />
            <DeleteEmployeeAction id={empl.id} name={empl.fullName} />
          </HStack>
        </Table.Cell>
      )}
    </Table.Row>
  );
};