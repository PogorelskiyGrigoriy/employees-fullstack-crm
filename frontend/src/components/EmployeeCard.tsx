/**
 * @module EmployeeCard
 * Mobile-first card component with strict typing and Chakra 3.0 syntax.
 * Designed for compact lists and touch interactions.
 */

import { Box, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { EmployeeIdentity } from "./ui/DataDisplay";
import { DeleteEmployeeAction } from "./DeleteEmployeeAction";
import { EditEmployeeAction } from "./EditEmployeeAction";
import { EmployeeDetailsDialog } from "./EmployeeDetailsDialog";
import type { Employee } from "@/schemas/employee.schema";
import { useRef } from "react";

interface EmployeeCardProps {
  readonly employee: Employee;
  readonly isAdmin: boolean;
}

export const EmployeeCard = ({ employee, isAdmin }: EmployeeCardProps) => {
  // Ref used to trigger the Details dialog when the whole card is clicked
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Box
      p={{ base: "3", sm: "4" }}
      bg="bg.panel"
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="sm"
      _active={{ bg: "bg.muted", transform: "scale(0.98)" }} // Visual feedback for touch
      transition="all 0.15s ease-out"
      cursor="pointer"
      onClick={() => triggerRef.current?.click()}
      overflow="hidden"
    >
      <HStack gap={{ base: "2", sm: "4" }} width="full" align="center">
        {/* Main Info Section */}
        <VStack align="start" gap="0" minW="0" flex="1">
          <EmployeeIdentity 
            name={employee.fullName} 
            avatar={employee.avatar ?? undefined} 
          />
          <Text 
            fontSize="xs" 
            color="fg.muted" 
            ml="12" // Aligns text with the name, skipping the avatar space
            lineClamp={1}
          >
            {employee.department}
          </Text>
        </VStack>
        
        <Spacer />

        {/* Actions Section: StopPropagation prevents opening details when clicking buttons */}
        <HStack gap="1" flexShrink={0} onClick={(e) => e.stopPropagation()}>
          {isAdmin && (
            <>
              <EditEmployeeAction employee={employee} />
              <DeleteEmployeeAction id={employee.id} name={employee.fullName} />
            </>
          )}
          
          {/* Hidden or secondary trigger for the details modal */}
          <Box ref={triggerRef}>
            <EmployeeDetailsDialog employee={employee} />
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
};