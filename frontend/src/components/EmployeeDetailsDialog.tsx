/**
 * @module EmployeeDetailsDialog
 * Detailed read-only view of employee profiles.
 * Features automated age calculation and consistent data formatting.
 */

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton, VStack, HStack, Text, Separator, Box } from "@chakra-ui/react";
import { LuChevronRight, LuBriefcase, LuCalendar, LuWallet } from "react-icons/lu";
import { EmployeeIdentity, CurrencyText, DateText, DeptBadge } from "./ui/DataDisplay";
import { calculateAge } from "@/utils/dateUtils";
import type { Employee } from "@/schemas/employee.schema";

interface Props {
  readonly employee: Employee;
}

/**
 * Modal dialog that presents full employee details.
 */
export const EmployeeDetailsDialog = ({ employee }: Props) => {
  return (
    <DialogRoot motionPreset="slide-in-bottom" size="sm">
      <DialogTrigger asChild>
        <IconButton
          aria-label="View details"
          variant="ghost"
          size="sm"
          color="fg.muted"
          // Prevents card click events from firing when the icon is clicked
          onClick={(e) => e.stopPropagation()} 
        >
          <LuChevronRight size="24" />
        </IconButton>
      </DialogTrigger>

      <DialogContent borderRadius="2xl" pb="4" bg="bg.panel">
        <DialogHeader>
          <DialogTitle fontSize="xl">Employee Profile</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <VStack align="stretch" gap="6">
            {/* Header section with identity molecule */}
            <Box py="2">
              <EmployeeIdentity 
                name={employee.fullName} 
                avatar={employee.avatar ?? undefined} 
              />
            </Box>

            <Separator />

            {/* Structured data rows */}
            <VStack align="stretch" gap="5">
              <InfoRow 
                icon={<LuBriefcase size="18" />} 
                label="Department" 
                value={<DeptBadge>{employee.department}</DeptBadge>} 
              />
              
              <InfoRow 
                icon={<LuCalendar size="18" />} 
                label="Birth Date" 
                value={
                  <VStack align="end" gap="0">
                    <DateText dateString={employee.birthDate} />
                    <Text fontSize="xs" color="fg.muted" fontWeight="normal">
                      {calculateAge(employee.birthDate)} years old
                    </Text>
                  </VStack>
                } 
              />

              <InfoRow 
                icon={<LuWallet size="18" />} 
                label="Monthly Salary" 
                value={<CurrencyText value={employee.salary} />} 
              />
            </VStack>
          </VStack>
        </DialogBody>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

/**
 * Internal helper for consistent key-value layout within the dialog.
 */
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <HStack justify="space-between" width="full" align="flex-start">
    <HStack color="fg.muted" gap="3">
      <Box color="blue.500">{icon}</Box>
      <Text fontSize="sm" fontWeight="medium">{label}</Text>
    </HStack>
    <Box fontWeight="semibold" textAlign="right">
      {value}
    </Box>
  </HStack>
);