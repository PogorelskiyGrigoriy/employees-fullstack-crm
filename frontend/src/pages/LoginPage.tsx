/**
 * @module LoginPage
 * Provides the entry point for user authentication.
 * Leverages React Hook Form for state management and Zod for schema validation.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Fieldset,
  Input,
  Stack,
  Container,
  VStack,
  Text,
} from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { useLogin } from "@/services/hooks/authHooks/useLogin";
import { loginSchema, type LoginData } from "@/schemas/auth.schema";

/**
 * LoginPage Component.
 * Features a centralized card layout with comprehensive error handling and loading states.
 */
export const LoginPage = () => {
  // Authentication logic via custom TanStack Query mutation hook
  const { mutate, isPending } = useLogin();

  /**
   * Form initialization.
   * 'onBlur' mode balances real-time feedback with non-intrusive UX.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: LoginData) => mutate(data);

  return (
    <Container maxW="lg" py={{ base: "12", md: "24" }}>
      {/* Main Login Card */}
      <Box p="10" borderWidth="1px" borderRadius="2xl" boxShadow="sm" bg="bg.panel">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Fieldset.Root size="lg" disabled={isPending}>
            <Stack gap="6">
              <Box textAlign="center">
                <Fieldset.Legend fontSize="3xl" fontWeight="bold">
                  Login
                </Fieldset.Legend>
              </Box>

              <Stack gap="4">
                {/* Email Field */}
                <Field
                  label="Email"
                  invalid={!!errors.email}
                  errorText={errors.email?.message}
                >
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="admin@tel-ran.com"
                    autoComplete="email"
                  />
                </Field>

                {/* Password Field */}
                <Field
                  label="Password"
                  invalid={!!errors.password}
                  errorText={errors.password?.message}
                >
                  <Input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </Field>
              </Stack>

              <Button
                type="submit"
                colorPalette="blue"
                width="full"
                loading={isPending}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </Stack>
          </Fieldset.Root>
        </form>

        {/* Demo Credentials Helper: 
          Visible only in the UI to facilitate testing/review. 
        */}
        <VStack
          mt="8"
          gap="2"
          p="4"
          bg="bg.muted"
          borderRadius="lg"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="border.subtle"
        >
          <Text fontSize="2xs" fontWeight="bold" color="fg.muted" textTransform="uppercase">
            Demo Access
          </Text>
          <VStack gap="0">
            <Text fontSize="xs" color="fg.subtle">
              Admin: <b>admin@tel-ran.com</b> / admin1234
            </Text>
            <Text fontSize="xs" color="fg.subtle">
              User: <b>user@tel-ran.com</b> / user1234
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};