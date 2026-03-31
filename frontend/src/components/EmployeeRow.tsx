/**
 * @module EmployeeRow
 * Standardized table row for the employee directory.
 * Refactored using AppBadge, RBACGuard, and Midnight Slate design tokens.
 */

import { Table, HStack, VStack, Text } from "@chakra-ui/react";

import { EmployeeIdentity } from "@/components/shared/molecules/EmployeeIdentity";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { CurrencyText, DateText } from "@/components/shared/atoms/DataDisplay";
import { RBACGuard } from "@/components/shared/organisms/RBACGuard";

import { DeleteEmployeeAction } from "./DeleteEmployeeAction";
import { EditEmployeeAction } from "./EditEmployeeAction";
import { calculateAge } from "@crm/shared/utils/date-utils";
import type { Employee } from "@crm/shared/schemas/employee.schema.js";

interface EmployeeRowProps {
  readonly employee: Employee;
}

export const EmployeeRow = ({ employee: empl }: EmployeeRowProps) => {
  const age = calculateAge(empl.birthDate);

  return (
    <Table.Row 
      _hover={{ bg: "bg.subtle" }} 
      transition="background-color 0.2s ease"
    >
      {/* 1. Identity: Avatar + Full Name */}
      <Table.Cell width="full">
        <EmployeeIdentity 
          name={empl.fullName} 
          avatar={empl.avatar ?? undefined} 
        />
      </Table.Cell>
      
      {/* 2. Department: Using the new universal AppBadge */}
      <Table.Cell whiteSpace="nowrap">
        <AppBadge type="dept" value={empl.department} />
      </Table.Cell>
      
      {/* 3. Temporal Data: Age and Birth Date */}
      <Table.Cell display={{ base: "none", lg: "table-cell" }} whiteSpace="nowrap">
        <VStack align="start" gap="0">
          <DateText dateString={empl.birthDate} />
          <Text fontSize="xs" color="fg.muted" fontWeight="medium">
            {age} years old
          </Text>
        </VStack>
      </Table.Cell>
      
      {/* 4. Financial Data: High emphasis for salary */}
      <Table.Cell textAlign="end" whiteSpace="nowrap">
        <Text fontWeight="bold" color="fg.emphasized" letterSpacing="tight">
          <CurrencyText value={empl.salary} />
        </Text>
      </Table.Cell>
      
      {/* 5. Actions: Protected by RBACGuard */}
      <RBACGuard roles={["ADMIN"]}>
        <Table.Cell textAlign="end" whiteSpace="nowrap">
          <HStack gap="2" justifyContent="flex-end">
            <EditEmployeeAction employee={empl} />
            <DeleteEmployeeAction id={empl.id} name={empl.fullName} />
          </HStack>
        </Table.Cell>
      </RBACGuard>
    </Table.Row>
  );
};