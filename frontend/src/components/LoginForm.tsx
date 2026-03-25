/**
 * @module LoginForm
 * Refactored to use ZodResolver for Single Source of Truth validation.
 */

"use client"

import { Button, Input, Stack, Heading, Box, Alert } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field } from "@/components/ui/field";
import { useLogin } from "@/services/hooks/authHooks/useLogin";
import { loginSchema, type LoginData } from "@crm/shared/schemas/auth.schema.js";

export const LoginForm = () => {
  const { mutate, isPending, isError, error, reset: resetMutation } = useLogin();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isValid, isDirty } 
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" }
  });

  const [email, password] = watch(["email", "password"]);
  
  useEffect(() => {
    if (isError) resetMutation();
  }, [email, password, isError, resetMutation]);

  const handleLogin = (data: LoginData) => {
    mutate(data);
  };

  // Extract server error message safely
  const serverErrorMessage = (error as any)?.response?.data?.error || error?.message || "Invalid credentials";

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

          {isError && (
            <Alert.Root status="error" variant="subtle" borderRadius="md">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title fontSize="xs">
                  {serverErrorMessage}
                </Alert.Title>
              </Alert.Content>
            </Alert.Root>
          )}

          <Stack gap="4">
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
                {...register("email")}
              />
            </Field>

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
                {...register("password")}
              />
            </Field>
          </Stack>

          <Button 
            type="submit" 
            colorPalette="blue" 
            loading={isPending} 
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