/**
 * @module DepartmentsTable
 * Presentational component for department-level analytics.
 * Refactored for the "Midnight Slate" theme using standardized atoms.
 */

import { Table, Text } from "@chakra-ui/react";
import { CurrencyText, AgeText } from "@/shared/ui/atoms/DataDisplay";
import { AppBadge } from "@/shared/ui/atoms/AppBadge";
import type { DepartmentInfo } from "@crm/shared/schemas/department.schema.js";

interface Props {
  readonly departmentsInfo: readonly DepartmentInfo[];
}

export const DepartmentsTable = ({ departmentsInfo }: Props) => {
  return (
    <Table.Root 
      variant="line" 
      size="md" 
      stickyHeader
      /** * Note: Outer borders and shadows are now handled by 
       * the parent AppPanel on the statistics page. 
       */
    >
      <Table.Header bg="bg.muted">
        <Table.Row>
          <Table.ColumnHeader py="4" fontWeight="bold" letterSpacing="tight">
            Department
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" fontWeight="bold">
            Employees
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" fontWeight="bold">
            Avg Salary
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center" fontWeight="bold">
            Avg Age
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {departmentsInfo.map((info) => {
          const hasEmployees = info.numEmployees > 0;
          
          return (
            <Table.Row 
              key={info.department} 
              _hover={{ bg: "bg.subtle" }}
              transition="background 0.2s"
            >
              {/* 1. Department Name: High Emphasis */}
              <Table.Cell 
                fontWeight="bold" 
                color="fg.emphasized" 
                letterSpacing="tight"
              >
                {info.department}
              </Table.Cell>
              
              {/* 2. Employee Count: Using standardized AppBadge */}
              <Table.Cell textAlign="center">
                <AppBadge type="count" value={info.numEmployees} />
              </Table.Cell>
              
              {/* 3. Financial Data: Conditional Formatting */}
              <Table.Cell textAlign="center">
                {hasEmployees ? (
                  <CurrencyText value={info.avgSalary} />
                ) : (
                  <Text color="fg.muted" opacity={0.5}>—</Text> 
                )}
              </Table.Cell>
              
              {/* 4. Demographic Data: Conditional Formatting */}
              <Table.Cell textAlign="center">
                {hasEmployees ? (
                  <AgeText value={info.avgAge} />
                ) : (
                  <Text color="fg.muted" opacity={0.5}>—</Text>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};