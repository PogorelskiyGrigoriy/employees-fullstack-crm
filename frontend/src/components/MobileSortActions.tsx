/**
 * @module MobileSortActions
 * Responsive sorting controls for mobile view.
 * Uses a menu-based UI to toggle sorting keys and directions (asc/desc).
 */

import { HStack, MenuRoot, MenuTrigger, MenuContent, MenuItem, Button, Text } from "@chakra-ui/react";
import { LuArrowDownAZ, LuArrowDownWideNarrow, LuCalendarDays, LuArrowUp, LuArrowDown, LuArrowUpDown } from "react-icons/lu";
import { useSortStore } from "@/store/sort-store";

/**
 * Renders a compact sorting interface visible only on mobile screens (<md).
 */
export const MobileSortActions = () => {
  const { sort, toggleSort } = useSortStore();

  /**
   * Configuration for sortable fields with their respective icons.
   */
  const sortOptions = [
    { key: "fullName", label: "Name", icon: <LuArrowDownAZ /> },
    { key: "salary", label: "Salary", icon: <LuArrowDownWideNarrow /> },
    { key: "birthDate", label: "Age", icon: <LuCalendarDays /> },
  ] as const;

  // Identify the currently active sorting strategy for the button label
  const currentOption = sortOptions.find(opt => opt.key === sort.key);

  return (
    <HStack justify="space-between" py="2" display={{ base: "flex", md: "none" }}>
      <Text fontSize="sm" fontWeight="bold" color="fg.muted">Sort by:</Text>
      
      <MenuRoot>
        <MenuTrigger asChild>
          <Button variant="outline" size="sm" gap="2" borderRadius="full" minW="120px">
            {currentOption ? (
              <>
                {currentOption.icon}
                {currentOption.label}
                {/* Visual feedback for sorting direction */}
                {sort.order === "asc" && <LuArrowUp size="14" />}
                {sort.order === "desc" && <LuArrowDown size="14" />}
              </>
            ) : (
              <>
                <LuArrowUpDown size="14" />
                Default
              </>
            )}
          </Button>
        </MenuTrigger>
        
        <MenuContent minW="150px">
          {sortOptions.map((option) => (
            <MenuItem 
              key={option.key} 
              value={option.key}
              onClick={() => toggleSort(option.key)}
              // Keeps the menu open for easier multi-step sorting changes if needed
              closeOnSelect={false}
              cursor="pointer"
            >
              <HStack justify="space-between" width="full">
                <HStack gap="2">
                  {option.icon}
                  <Text>{option.label}</Text>
                </HStack>
                {/* Highlight the active sort order in the list */}
                {sort.key === option.key && sort.order && (
                  <Text fontSize="2xs" fontWeight="black" color="blue.500" textTransform="uppercase">
                    {sort.order}
                  </Text>
                )}
              </HStack>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
};