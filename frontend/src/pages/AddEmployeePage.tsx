/**
 * @module AddEmployeePage
 * Page component for registering new employees.
 * Orchestrates the submission logic, toast notifications, and navigation redirects.
 */

"use client"

import { Container, Heading, Box, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { EmployeeForm } from "@/components/EmployeeForm";
import { useAddEmployee } from "@/services/hooks/mutationHooks/useAddEmployee";
import { toaster } from "@/components/ui/toaster-config"; 
import type { NewEmployee } from "@/schemas/employee.schema";
import { ROUTES } from "@/config/navigation";
import { CloseButton } from "@/components/ui/close-button";

/**
 * Renders a centered form layout for adding a new employee.
 * Handles the integration between the form UI and the backend mutation.
 */
const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddEmployee();

  const handleClose = () => navigate(ROUTES.HOME);

  /**
   * Submission handler:
   * Triggers the mutation and provides visual feedback via a toast on success
   * before redirecting the user back to the dashboard.
   */
  const handleAdd = (data: NewEmployee) => {
    mutate(data, {
      onSuccess: (newEmployee) => {
        toaster.create({
          title: "Employee Added",
          description: `${newEmployee.fullName} has been successfully registered.`,
          type: "success",
        });
        handleClose();
      },
      // Error handling is managed globally by the mutation hook or toaster config
    });
  };

  return (
    <Container maxW="lg" py={{ base: "6", md: "12" }} position="relative">
      {/* Quick escape button for better UX */}
      <CloseButton 
        position="absolute" 
        top={{ base: "2", md: "4" }} 
        right={{ base: "2", md: "4" }} 
        onClick={handleClose}
        aria-label="Close and return to home"
        borderRadius="full"
        _hover={{ bg: "bg.emphasized" }}
      />

      <Stack gap="8">
        <Box textAlign="center">
          <Heading size="3xl" letterSpacing="tight">New Hire</Heading>
          <Box color="fg.muted" fontSize="sm" mt="2">
            Fill in the details to add a new member to the team.
          </Box>
        </Box>

        {/* Form Container with distinct visual elevation */}
        <Box 
          p={{ base: "6", md: "10" }} 
          borderWidth="1px" 
          borderColor="border.subtle" 
          borderRadius="2xl" 
          bg="bg.panel"
          shadow="sm"
        >
          <EmployeeForm 
            onSubmit={handleAdd} 
            isLoading={isPending} 
            onCancel={handleClose} 
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default AddEmployeePage;