/**
 * @module AddEmployeePage
 */

"use client"

import { Container, Heading, Box, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { EmployeeForm } from "@/components/EmployeeForm";
import { useAddEmployee } from "@/services/hooks/mutation-hooks/use-add-employee.ts";
import type { NewEmployee } from "@crm/shared/schemas/employee.schema.js";
import { ROUTES } from "@/config/navigation";
import { CloseButton } from "@/components/ui/close-button";

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
    <Container maxW="lg" py={{ base: "6", md: "12" }} position="relative">
      <CloseButton 
        position="absolute" 
        top={{ base: "2", md: "4" }} 
        right={{ base: "2", md: "4" }} 
        onClick={handleClose}
        borderRadius="full"
      />

      <Stack gap="8">
        <Box textAlign="center">
          <Heading size="3xl" letterSpacing="tight">New Hire</Heading>
          <Box color="fg.muted" fontSize="sm" mt="2">
            Fill in the details to add a new member to the team.
          </Box>
        </Box>

        <Box 
          p={{ base: "6", md: "10" }} 
          borderWidth="1px" 
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