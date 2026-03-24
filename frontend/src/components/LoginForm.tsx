/**
 * @module LoginForm
 * Accessible authentication form with real-time validation.
 * Uses React Hook Form for state management and TanStack Query for the login mutation.
 */

"use client"

import { Button, Input, Stack, Heading, Box, Alert } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { Field } from "@/components/ui/field";
import { useLogin } from "@/services/hooks/authHooks/useLogin";
import type { LoginData } from "@/schemas/auth.schema";

/**
 * Handles user login with validation and server-side error feedback.
 */
export const LoginForm = () => {
  const { mutate, isPending, isError, error, reset: resetMutation } = useLogin();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isValid, isDirty } 
  } = useForm<LoginData>({
    mode: "onBlur", // Validates when user leaves the field for a less intrusive UX
    defaultValues: { email: "", password: "" }
  });

  /**
   * UX Optimization:
   * Clears the previous "Invalid credentials" error message as soon as the user
   * starts typing a new email or password, providing immediate feedback.
   */
  const [email, password] = watch(["email", "password"]);
  useEffect(() => {
    if (isError) resetMutation();
  }, [email, password, isError, resetMutation]);

  const handleLogin = (data: LoginData) => {
    mutate(data);
  };

  return (
    <Box 
      maxW="380px" 
      w="full" 
      mx="auto" 
      p="6" 
      borderRadius="xl" 
      shadow="sm" 
      border="1px solid" 
      borderColor="border.subtle"
    >
      <form onSubmit={handleSubmit(handleLogin)}>
        <Stack gap="5">
          <Heading size="lg" textAlign="center" letterSpacing="tight">
            Sign In
          </Heading>

          {/* Authentication Error Alert: Shows if the API returns an error */}
          {isError && (
            <Alert.Root status="error" variant="subtle" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title fontSize="xs">
                  {error instanceof Error ? error.message : "Invalid credentials"}
                </Alert.Title>
              </Alert.Content>
            </Alert.Root>
          )}

          <Stack gap="4">
            {/* Email Field with validation */}
            <Field 
              label="Email" 
              invalid={!!errors.email} 
              errorText={errors.email?.message}
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder="jane.doe@company.com"
                disabled={isPending}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Enter a valid email"
                  }
                })}
              />
            </Field>

            {/* Password Field with length requirement */}
            <Field 
              label="Password" 
              invalid={!!errors.password} 
              errorText={errors.password?.message}
            >
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isPending}
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" }
                })}
              />
            </Field>
          </Stack>

          <Button 
            type="submit" 
            colorPalette="blue" 
            loading={isPending} 
            // Ensures button is clickable only when form is valid and touched
            disabled={!isValid || !isDirty}
            width="full"
            mt="2"
            size="lg"
          >
            Login to Dashboard
          </Button>
        </Stack>
      </form>
    </Box>
  );
};