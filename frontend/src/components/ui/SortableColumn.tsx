/**
 * @module SortableColumn
 * A specialized table header component that integrates with the global sort store.
 * Supports cyclic sorting states and consistent visual feedback.
 */

import { Box, HStack, Text, Table, type TableColumnHeaderProps } from "@chakra-ui/react";
import { LuArrowUp, LuArrowDown, LuArrowUpDown } from "react-icons/lu";
import { useSortStore } from "@/store/sort-store";
import type { Employee } from "@/schemas/employee.schema";

interface SortableColumnProps extends TableColumnHeaderProps {
  /** The employee property associated with this column */
  field: keyof Employee;
  children: React.ReactNode;
}

export const SortableColumn = ({ 
  field, 
  children, 
  textAlign = "start", 
  ...rest // Collects Chakra layout props (display, width, etc.)
}: SortableColumnProps) => {
  const currentSortKey = useSortStore((state) => state.sort.key);
  const currentOrder = useSortStore((state) => state.sort.order);
  const toggleSort = useSortStore((state) => state.toggleSort);

  const isSorted = currentSortKey === field;
  const handleToggle = () => toggleSort(field);

  return (
    <Table.ColumnHeader
      onClick={handleToggle}
      cursor="pointer"
      _hover={{ bg: "bg.muted" }}
      textAlign={textAlign}
      whiteSpace="nowrap"
      transition="background 0.2s"
      userSelect="none"
      {...rest} // Applies passed layout props directly to the header cell
    >
      <HStack 
        gap="2" 
        justifyContent={textAlign === "end" ? "flex-end" : "flex-start"}
      >
        <Text fontWeight="semibold" color={isSorted ? "fg.info" : "fg"}>
          {children}
        </Text>
        
        {/* Dynamic Sort Icon Indicator */}
        <Box 
          color={isSorted ? "blue.500" : "fg.subtle"} 
          flexShrink={0}
          display="flex"
          alignItems="center"
        >
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