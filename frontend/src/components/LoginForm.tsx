/**
 * @module LoginForm
 * Authentication entry point for the CRM.
 * Refactored with AppPanel and branded Midnight Slate tokens.
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
  Alert,
  Fieldset,
  Text,
  VStack,
  Separator,
  Icon
} from "@chakra-ui/react";
import { LuLogIn, LuInfo } from "react-icons/lu";

import { Field } from "@/components/ui/field";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
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
    <AppPanel 
      maxW="420px" 
      mx="auto" 
      p={{ base: "8", md: "10" }} 
      shadow="2xl"
    >
      <form onSubmit={handleSubmit(handleLogin)}>
        <Fieldset.Root disabled={isPending}>
          <Stack gap="8">
            {/* 1. Header Section */}
            <Stack gap="2" textAlign="center">
              <Heading size="2xl" letterSpacing="tight" fontWeight="black">
                Welcome Back
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Access your dashboard and manage your workforce
              </Text>
            </Stack>

            {/* 2. Error Display */}
            {isError && (
              <Alert.Root status="error" variant="subtle" borderRadius="xl">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title fontSize="xs">{serverErrorMessage}</Alert.Title>
                </Alert.Content>
              </Alert.Root>
            )}

            {/* 3. Inputs using Subtle Variant */}
            <Stack gap="5">
              <Field 
                label="Email address" 
                invalid={!!errors.email} 
                errorText={errors.email?.message}
              >
                <Input
                  type="email"
                  variant="subtle"
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
                  variant="subtle"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  size="lg"
                  {...register("password")}
                />
              </Field>
            </Stack>

            {/* 4. Branded Sign In Button */}
            <Button 
              type="submit" 
              colorPalette="brand" 
              loading={isPending} 
              disabled={!isValid || !isDirty}
              width="full"
              size="xl"
              mt="2"
              shadow="lg"
            >
              <LuLogIn /> Sign In
            </Button>
          </Stack>
        </Fieldset.Root>
      </form>

      {/* --- 5. DEMO CREDENTIALS HELPER --- */}
      <Stack gap="5" mt="10">
        <HStack gap="4">
          <Separator flex="1" borderColor="border.subtle" />
          <HStack gap="1" color="fg.muted">
            <Icon as={LuInfo} boxSize="3" />
            <Text fontSize="2xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
              Quick Access
            </Text>
          </HStack>
          <Separator flex="1" borderColor="border.subtle" />
        </HStack>
        
        <VStack gap="2" align="stretch">
          <HStack 
            p="3" 
            bg="bg.muted/30" 
            borderRadius="xl" 
            borderWidth="1px" 
            borderColor="border.subtle" 
            justify="space-between"
          >
            <Text fontSize="xs" color="fg.muted">Admin</Text>
            <Text fontSize="xs" fontWeight="bold">admin@crm.com / password</Text>
          </HStack>
          
          <HStack 
            p="3" 
            bg="bg.muted/30" 
            borderRadius="xl" 
            borderWidth="1px" 
            borderColor="border.subtle" 
            justify="space-between"
          >
            <Text fontSize="xs" color="fg.muted">User</Text>
            <Text fontSize="xs" fontWeight="bold">user@crm.com / password</Text>
          </HStack>
        </VStack>
      </Stack>
    </AppPanel>
  );
};