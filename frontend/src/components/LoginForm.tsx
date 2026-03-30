/**
 * @module LoginForm
 * Centralized authentication form with integrated Demo Credentials helper.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button, 
  Input, 
  Stack,
  HStack, 
  Heading, 
  Box, 
  Alert,
  Fieldset,
  Text,
  VStack,
  Separator
} from "@chakra-ui/react";

import { Field } from "@/components/ui/field";
import { useLogin } from "@/services/hooks/auth-hooks/use-login";
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

  const serverErrorMessage = (error as any)?.response?.data?.error || error?.message || "Invalid credentials";

  return (
    <Box 
      maxW="400px" 
      w="full" 
      mx="auto" 
      p={{ base: "6", md: "8" }} 
      borderRadius="2xl" 
      shadow="md" 
      border="1px solid" 
      borderColor="border.subtle"
      bg="bg.panel"
    >
      <form onSubmit={handleSubmit(handleLogin)}>
        <Fieldset.Root disabled={isPending}>
          <Stack gap="6">
            <Stack gap="1" textAlign="center">
              <Heading size="xl" letterSpacing="tight">
                Welcome Back
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Enter your credentials to access the CRM
              </Text>
            </Stack>

            {isError && (
              <Alert.Root status="error" variant="subtle" borderRadius="lg">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title fontSize="xs">{serverErrorMessage}</Alert.Title>
                </Alert.Content>
              </Alert.Root>
            )}

            <Stack gap="4">
              <Field 
                label="Email address" 
                invalid={!!errors.email} 
                errorText={errors.email?.message}
              >
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@crm.com"
                  size="lg"
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
                  size="lg"
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
              size="xl"
              mt="2"
            >
              Sign In
            </Button>
          </Stack>
        </Fieldset.Root>
      </form>

      {/* --- DEMO CREDENTIALS HELPER --- */}
      <Stack gap="4" mt="8">
        <HStack>
          <Separator flex="1" />
          <Text fontSize="2xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" whiteSpace="nowrap">
            Demo Access
          </Text>
          <Separator flex="1" />
        </HStack>
        
        <VStack gap="1" align="stretch">
          <Box p="2" bg="bg.muted" borderRadius="md" border="1px dashed" borderColor="border.subtle">
            <Text fontSize="xs" color="fg.subtle">
              <b>Admin:</b> admin@crm.com / password
            </Text>
          </Box>
          <Box p="2" bg="bg.muted" borderRadius="md" border="1px dashed" borderColor="border.subtle">
            <Text fontSize="xs" color="fg.subtle">
              <b>User:</b> user@crm.com / password
            </Text>
          </Box>
        </VStack>
      </Stack>
    </Box>
  );
};