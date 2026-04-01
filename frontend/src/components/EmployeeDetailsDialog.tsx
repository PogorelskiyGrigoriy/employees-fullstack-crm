/**
 * @module EmployeeDetailsDialog
 * Read-only profile view aligned with the "Midnight Slate" system.
 * Refactored: Uses adaptive AppDialog atoms for consistent depth and positioning.
 */

import {
  DialogBody,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton, VStack, HStack, Text, Box, Icon, Center } from "@chakra-ui/react";
import { LuChevronRight, LuBriefcase, LuCalendar, LuWallet } from "react-icons/lu";

import { EmployeeIdentity } from "@/components/shared/molecules/EmployeeIdentity";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { CurrencyText, DateText } from "@/components/shared/atoms/DataDisplay";

// Наши новые адаптивные атомы
import { AppDialogRoot, AppDialogContent } from "@/components/shared/atoms/AppDialog";

import { calculateAge } from "@crm/shared/utils/date-utils";
import type { Employee } from "@crm/shared/schemas/employee.schema.js";

interface Props {
  readonly employee: Employee;
}

export const EmployeeDetailsDialog = ({ employee }: Props) => {
  return (
    /* 1. AppDialogRoot автоматически применит Backdrop и адаптивный размер */
    <AppDialogRoot size="sm">
      <DialogTrigger asChild>
        <IconButton
          aria-label="View details"
          variant="ghost"
          size="sm"
          color="fg.muted"
          _hover={{ color: "brand.500", bg: "brand.500/10" }}
          onClick={(e) => e.stopPropagation()} 
        >
          <LuChevronRight size="24" />
        </IconButton>
      </DialogTrigger>

      /* 2. AppDialogContent добавит Portal, Positioner, тени и крестик */
      <AppDialogContent pb="4">
        <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
          <DialogTitle fontSize="xl" letterSpacing="tight">
            Employee Profile
          </DialogTitle>
        </DialogHeader>

        <DialogBody py={6}>
          <VStack align="stretch" gap={8}>
            {/* Header Identity Block */}
            <Box>
              <EmployeeIdentity 
                name={employee.fullName} 
                avatar={employee.avatar ?? undefined} 
              />
            </Box>

            {/* Detailed Info Rows */}
            <VStack align="stretch" gap={5}>
              <InfoRow 
                icon={LuBriefcase} 
                label="Department" 
                value={<AppBadge type="dept" value={employee.department} />} 
              />
              
              <InfoRow 
                icon={LuCalendar} 
                label="Birth Date" 
                value={
                  <VStack align="end" gap="0">
                    <DateText dateString={employee.birthDate} />
                    <Text fontSize="xs" color="fg.muted" fontWeight="medium">
                      {calculateAge(employee.birthDate)} years old
                    </Text>
                  </VStack>
                } 
              />

              <InfoRow 
                icon={LuWallet} 
                label="Monthly Salary" 
                value={<CurrencyText value={employee.salary} />} 
              />
            </VStack>
          </VStack>
        </DialogBody>
      </AppDialogContent>
    </AppDialogRoot>
  );
};

/* --- Helper Component (без изменений, так как он завязан на внутреннюю верстку) --- */

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <HStack justify="space-between" width="full" align="center">
    <HStack gap="3">
      <Center 
        boxSize="8" 
        borderRadius="md" 
        bg="brand.500/10" 
        color="brand.500"
      >
        <Icon as={icon} boxSize="4" />
      </Center>
      <Text fontSize="sm" fontWeight="semibold" color="fg.emphasized">
        {label}
      </Text>
    </HStack>
    <Box textAlign="right">
      {value}
    </Box>
  </HStack>
);