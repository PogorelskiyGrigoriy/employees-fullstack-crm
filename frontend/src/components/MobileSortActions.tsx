/**
 * @module MobileSortActions
 * Mobile-first sorting controls for the directory.
 * Refactored with Midnight Slate tokens and consistent "pill" styling.
 */

import { HStack, MenuRoot, MenuTrigger, MenuContent, MenuItem, Button, Text, Icon, Box } from "@chakra-ui/react";
import { 
  LuArrowDownAZ, 
  LuArrowDownWideNarrow, 
  LuCalendarDays, 
  LuArrowUp, 
  LuArrowDown, 
  LuArrowUpDown 
} from "react-icons/lu";
import { useSortStore } from "@/store/sort-store";

export const MobileSortActions = () => {
  const { sort, toggleSort } = useSortStore();

  const sortOptions = [
    { key: "fullName", label: "Name", icon: LuArrowDownAZ },
    { key: "salary", label: "Salary", icon: LuArrowDownWideNarrow },
    { key: "birthDate", label: "Age", icon: LuCalendarDays },
  ] as const;

  const currentOption = sortOptions.find(opt => opt.key === sort.key);

  return (
    <HStack justify="space-between" py="3" display={{ base: "flex", md: "none" }}>
      <Text 
        fontSize="xs" 
        fontWeight="black" 
        color="fg.muted" 
        textTransform="uppercase" 
        letterSpacing="widest"
      >
        Sort by:
      </Text>
      
      <MenuRoot positioning={{ placement: "bottom-end" }}>
        <MenuTrigger asChild>
          <Button 
            variant="subtle" 
            size="sm" 
            gap="2" 
            borderRadius="full" 
            minW="130px"
            bg="bg.panel"
            borderWidth="1px"
            borderColor="border.subtle"
            _active={{ transform: "scale(0.95)" }}
          >
            {currentOption ? (
              <>
                <Icon as={currentOption.icon} color="brand.500" />
                <Text fontWeight="bold">{currentOption.label}</Text>
                <Box color="brand.500">
                  {sort.order === "asc" ? <LuArrowUp size="14" /> : <LuArrowDown size="14" />}
                </Box>
              </>
            ) : (
              <>
                <LuArrowUpDown size="14" />
                <Text>Default</Text>
              </>
            )}
          </Button>
        </MenuTrigger>
        
        <MenuContent 
          minW="180px" 
          bg="bg.panel" 
          borderRadius="xl" 
          shadow="xl"
          borderColor="border.subtle"
        >
          {sortOptions.map((option) => {
            const isActive = sort.key === option.key;
            
            return (
              <MenuItem 
                key={option.key} 
                value={option.key}
                onClick={() => toggleSort(option.key)}
                closeOnSelect={false}
                cursor="pointer"
                py="3"
                _hover={{ bg: "bg.muted" }}
                bg={isActive ? "brand.500/5" : "transparent"}
              >
                <HStack justify="space-between" width="full">
                  <HStack gap="3">
                    <Icon 
                      as={option.icon} 
                      color={isActive ? "brand.500" : "fg.muted"} 
                    />
                    <Text 
                      fontWeight={isActive ? "bold" : "medium"}
                      color={isActive ? "fg.emphasized" : "inherit"}
                    >
                      {option.label}
                    </Text>
                  </HStack>
                  
                  {isActive && (
                    <Text 
                      fontSize="2xs" 
                      fontWeight="black" 
                      color="brand.500" 
                      textTransform="uppercase"
                      bg="brand.500/10"
                      px="2"
                      py="0.5"
                      borderRadius="sm"
                    >
                      {sort.order}
                    </Text>
                  )}
                </HStack>
              </MenuItem>
            );
          })}
        </MenuContent>
      </MenuRoot>
    </HStack>
  );
};