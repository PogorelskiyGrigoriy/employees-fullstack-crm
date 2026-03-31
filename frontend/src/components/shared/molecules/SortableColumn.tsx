/**
 * @module SortableColumn
 * Table header with integrated sorting logic and semantic styling.
 */
import { Box, HStack, Text, Table, type TableColumnHeaderProps } from "@chakra-ui/react";
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from "react-icons/lu";
import { useSortStore } from "@/store/sort-store";
import type { Employee } from "@crm/shared/schemas/employee.schema";

interface SortableColumnProps extends TableColumnHeaderProps {
  field: keyof Employee;
  children: React.ReactNode;
}

export const SortableColumn = ({ field, children, textAlign = "start", ...rest }: SortableColumnProps) => {
  const currentSortKey = useSortStore((state) => state.sort.key);
  const currentOrder = useSortStore((state) => state.sort.order);
  const toggleSort = useSortStore((state) => state.toggleSort);

  const isSorted = currentSortKey === field;

  return (
    <Table.ColumnHeader
      onClick={() => toggleSort(field)}
      cursor="pointer"
      _hover={{ bg: "bg.muted" }} // Using our token
      textAlign={textAlign}
      whiteSpace="nowrap"
      transition="background 0.2s"
      userSelect="none"
      {...rest}
    >
      <HStack gap="2" justifyContent={textAlign === "end" ? "flex-end" : "flex-start"}>
        <Text fontWeight="semibold" color={isSorted ? "brand.500" : "fg.default"}>
          {children}
        </Text>
        <Box color={isSorted ? "brand.500" : "fg.muted"} flexShrink={0} display="flex">
          {isSorted ? (
            currentOrder === "asc" ? <LuArrowUp size="16" /> : <LuArrowDown size="16" />
          ) : (
            <LuArrowUpDown size="14" style={{ opacity: 0.3 }} />
          )}
        </Box>
      </HStack>
    </Table.ColumnHeader>
  );
};