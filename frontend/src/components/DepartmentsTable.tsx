/**
 * @module DepartmentsTable
 * A data table that displays aggregated statistics per department.
 * Uses shared UI components for consistent numeric and currency formatting.
 */

import { Table, Text } from "@chakra-ui/react";
import { CountBadge, CurrencyText, AgeText } from "./ui/DataDisplay";
import type { DepartmentInfo } from "@/schemas/department.schema";

interface Props {
  /** Aggregated department metrics from the analytics hook */
  readonly departmentsInfo: readonly DepartmentInfo[];
}

/**
 * Presentational component for department-level analytics.
 */
export const DepartmentsTable = ({ departmentsInfo }: Props) => {
  return (
    <Table.Root 
      variant="line" 
      size="md" 
      showColumnBorder 
      interactive
      stickyHeader
      shadow="sm" 
      borderRadius="lg"
      overflow="hidden"
    >
      <Table.Header>
        <Table.Row bg="bg.subtle">
          <Table.ColumnHeader py="4" fontWeight="bold">Department</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" fontWeight="bold">Employees</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" fontWeight="bold">Avg Salary</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" fontWeight="bold">Avg Age</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {departmentsInfo.map((info) => {
          // Guard check to handle empty departments gracefully
          const hasEmployees = info.numEmployees > 0;
          
          return (
            <Table.Row 
              key={info.department} 
              _hover={{ bg: "bg.muted" }}
            >
              <Table.Cell fontWeight="semibold" color="fg.emphasized">
                {info.department}
              </Table.Cell>
              
              <Table.Cell textAlign="center">
                <CountBadge value={info.numEmployees} />
              </Table.Cell>
              
              {/* Conditional rendering for salary: shows fallback if 0 employees */}
              <Table.Cell textAlign="center">
                {hasEmployees ? (
                  <CurrencyText value={info.avgSalary} />
                ) : (
                  <Text color="fg.muted">—</Text> 
                )}
              </Table.Cell>
              
              {/* Conditional rendering for age: shows fallback if 0 employees */}
              <Table.Cell textAlign="center">
                {hasEmployees ? (
                  <AgeText value={info.avgAge} />
                ) : (
                  <Text color="fg.muted">—</Text>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};