/**
 * @module EmployeeCard
 * Mobile-first card component with integrated RBAC via useUserRole.
 */

import { useRef } from "react";
import { Box, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { EmployeeIdentity } from "./ui/DataDisplay";
import { DeleteEmployeeAction } from "./DeleteEmployeeAction";
import { EditEmployeeAction } from "./EditEmployeeAction";
import { EmployeeDetailsDialog } from "./EmployeeDetailsDialog";

import { useUserRole } from "@/store/auth-store";
import type { Employee } from "@crm/shared/schemas/employee.schema.js";

interface EmployeeCardProps {
  readonly employee: Employee;
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const role = useUserRole();
  const isAdmin = role === "ADMIN";

  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <Box
      p={{ base: "3", sm: "4" }}
      bg="bg.panel"
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="sm"
      _active={{ bg: "bg.muted", transform: "scale(0.98)" }}
      transition="all 0.15s ease-out"
      cursor="pointer"
      onClick={() => triggerRef.current?.click()}
      overflow="hidden"
    >
      <HStack gap={{ base: "2", sm: "4" }} width="full" align="center">
        <VStack align="start" gap="0" minW="0" flex="1">
          <EmployeeIdentity 
            name={employee.fullName} 
            avatar={employee.avatar ?? undefined} 
          />
          <Text 
            fontSize="xs" 
            color="fg.muted" 
            ml="12" 
            lineClamp={1}
          >
            {employee.department}
          </Text>
        </VStack>
        
        <Spacer />

        <HStack gap="1" flexShrink={0} onClick={(e) => e.stopPropagation()}>
          {isAdmin && (
            <>
              <EditEmployeeAction employee={employee} />
              <DeleteEmployeeAction id={employee.id} name={employee.fullName} />
            </>
          )}
          
          <Box ref={triggerRef}>
            <EmployeeDetailsDialog employee={employee} />
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
};