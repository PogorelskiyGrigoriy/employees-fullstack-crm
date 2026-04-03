/**
 * @module AddEmployeePage
 * Focused view for creating new employee records.
 * Refactored to use AppPanel and standardized typography.
 */
"use client"

import { Container, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { EmployeeForm } from "@/components/EmployeeForm";
import { PageHeader } from "@/shared/ui/molecules/PageHeader";
import { AppPanel } from "@/shared/ui/atoms/AppPanel";
import { CloseButton } from "@/shared/ui/chakra/close-button";

import { useAddEmployee } from "@/services/hooks/mutation-hooks/use-add-employee.ts";
import { ROUTES } from "@/config/navigation";
import type { NewEmployee } from "@crm/shared/schemas/employee.schema.js";

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddEmployee();

  const handleClose = () => navigate(ROUTES.HOME);

  const handleAdd = (data: NewEmployee) => {
    mutate(data, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Container maxW="lg" py={{ base: "8", md: "16" }} position="relative">
      {/* 1. Global Navigation Exit */}
      <CloseButton 
        position="absolute" 
        top={{ base: "2", md: "6" }} 
        right={{ base: "2", md: "6" }} 
        onClick={handleClose}
        borderRadius="full"
        variant="ghost"
        _hover={{ bg: "whiteAlpha.100" }}
      />

      <Stack gap="10">
        {/* 2. Standardized Header (Centered for this focus-view) */}
        <PageHeader 
          title="New Hire" 
          description="Fill in the details to add a new member to the team."
          textAlign="center"
          alignItems="center"
          mb="0" // Reset margin to use Stack gap
        />

        {/* 3. Form Container using AppPanel */}
        <AppPanel 
          p={{ base: "6", md: "10" }} 
          shadow="lg" // Slightly stronger shadow for the focus form
        >
          <EmployeeForm 
            onSubmit={handleAdd} 
            isLoading={isPending} 
            onCancel={handleClose} 
          />
        </AppPanel>
      </Stack>
    </Container>
  );
};

export default AddEmployeePage;