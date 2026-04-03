/**
 * @module EditEmployeeAction
 * Drawer-based action for modifying employee information.
 * Refactored to use ActionButton atom and Midnight Slate design tokens.
 */

import { useState } from "react";
import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { LuPencil } from "react-icons/lu";

import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from "@/shared/ui/chakra/drawer";
import { EmployeeForm } from "./EmployeeForm";
import { ActionButton } from "@/shared/ui/atoms/ActionButton";

import { useUpdateEmployee } from "@/services/hooks/mutation-hooks/use-update-employee";
import { toaster } from "@/shared/ui/toaster-config";
import type { Employee, NewEmployee } from "@crm/shared/schemas/employee.schema.js";

interface Props {
  employee: Employee;
}

export const EditEmployeeAction = ({ employee }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useUpdateEmployee();

  const handleUpdate = (formData: NewEmployee) => {
    mutate(
      {
        id: employee.id,
        changes: formData 
      },
      {
        onSuccess: () => {
          toaster.create({
            title: "Changes saved",
            description: `${formData.fullName} profile updated.`,
            type: "success",
          });
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
      placement={{ base: "bottom", md: "end" }}
      size={{ base: "full", md: "xs" }}
    >
      <DrawerBackdrop />

      <DrawerTrigger asChild>
        {/* 1. Replacing manual IconButton with our smart ActionButton atom */}
        <ActionButton 
          actionType="edit" 
          disabled={isPending}
          label={`Edit profile for ${employee.fullName}`}
        />
      </DrawerTrigger>

      <DrawerContent
        bg="bg.panel"
        borderTopRadius={{ base: "2xl", md: "none" }}
        borderLeftWidth={{ base: "0", md: "1px" }}
        borderColor="border.subtle"
        maxH={{ base: "90vh", md: "100vh" }}
        boxShadow="2xl"
      >
        {/* 2. Visual Grabber for Mobile - Styled with subtle border tokens */}
        <Box
          display={{ base: "block", md: "none" }}
          w="10" h="1" bg="border.subtle" borderRadius="full"
          mx="auto" mt="3"
        />

        <DrawerHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
          <DrawerTitle>
            <HStack gap={3}>
              <Icon as={LuPencil} color="brand.500" />
              <Text letterSpacing="tight">Edit Profile</Text>
            </HStack>
          </DrawerTitle>
        </DrawerHeader>

        <DrawerBody pb="8" pt={6}>
          <EmployeeForm
            employee={employee}
            onSubmit={handleUpdate}
            isLoading={isPending}
            onCancel={() => setIsOpen(false)}
          />
        </DrawerBody>

        <DrawerCloseTrigger color="fg.muted" />
      </DrawerContent>
    </DrawerRoot>
  );
};