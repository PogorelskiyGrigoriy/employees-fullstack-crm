/**
 * @module EmployeeCard
 * Mobile-optimized card for the employee directory.
 * Refactored using AppPanel and RBACGuard for consistent security and styling.
 */

import { useRef } from "react";
import { HStack, Spacer, Text, VStack, Box } from "@chakra-ui/react";

import { EmployeeIdentity } from "@/shared/ui/molecules/EmployeeIdentity";
import { AppPanel } from "@/shared/ui/atoms/AppPanel";
import { RBACGuard } from "@/shared/ui/organisms/RBACGuard";

import { DeleteEmployeeAction } from "./DeleteEmployeeAction";
import { EditEmployeeAction } from "./EditEmployeeAction";
import { EmployeeDetailsDialog } from "./EmployeeDetailsDialog";

import type { Employee } from "@crm/shared/schemas/employee.schema.js";

interface EmployeeCardProps {
  readonly employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <AppPanel
      p={{ base: "3", sm: "4" }}
      // Interactive feedback
      cursor="pointer"
      _active={{ 
        bg: "bg.muted", 
        transform: "scale(0.98)",
        transition: "all 0.1s ease-in" 
      }}
      transition="all 0.2s ease-out"
      onClick={() => triggerRef.current?.click()}
      position="relative"
      overflow="hidden"
    >
      <HStack gap={{ base: "3", sm: "4" }} width="full" align="center">
        {/* 1. Primary Info Section */}
        <VStack align="start" gap="0" minW="0" flex="1">
          <EmployeeIdentity 
            name={employee.fullName} 
            avatar={employee.avatar ?? undefined} 
          />
          <Text 
            fontSize="xs" 
            color="fg.muted" 
            ml="11"
            fontWeight="medium"
            letterSpacing="tight"
            truncate
          >
            {employee.department}
          </Text>
        </VStack>
        
        <Spacer />

        {/* 2. Action Toolbar */}
        <HStack 
          gap="1" 
          flexShrink={0} 
          onClick={(e) => e.stopPropagation()} // Prevents dialog from opening when clicking buttons
        >
          {/* Using RBACGuard instead of manual isAdmin checks */}
          <RBACGuard roles={["ADMIN"]}>
            <EditEmployeeAction employee={employee} />
            <DeleteEmployeeAction id={employee.id} name={employee.fullName} />
          </RBACGuard>
          
          {/* Hidden trigger for the full-card click interaction */}
          <Box ref={triggerRef} visibility="hidden" position="absolute" width="0" height="0">
            <EmployeeDetailsDialog employee={employee} />
          </Box>
        </HStack>
      </HStack>
    </AppPanel>
  );
};