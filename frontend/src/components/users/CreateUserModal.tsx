/**
 * @module CreateUserModal
 * Refactored to align with the "Midnight Slate" design system.
 * Uses semantic tokens and brand color palette.
 */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button, 
  Stack, 
  Input, 
  NativeSelect,
  HStack,
  Text,
  Icon
} from "@chakra-ui/react";
import { LuUserPlus, LuX, LuCheck } from "react-icons/lu";

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field } from "@/components/ui/field";
import { createUserSchema, type CreateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { useCreateUser } from "@/services/hooks/user-hooks/use-users";

interface CreateUserModalProps {
  isOpen: boolean;
  onOpenChange: (details: { open: boolean }) => void;
}

export const CreateUserModal = ({ isOpen, onOpenChange }: CreateUserModalProps) => {
  const { mutate, isPending } = useCreateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "USER"
    }
  });

  const onSubmit = (data: CreateUserDto) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onOpenChange({ open: false });
      }
    });
  };

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={onOpenChange}
      size={{ base: "full", md: "md" }}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent bg="bg.panel" borderRadius="2xl" shadow="2xl" borderWidth="1px" borderColor="border.subtle">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
            <DialogTitle>
              <HStack gap={3}>
                <Icon as={LuUserPlus} color="brand.500" />
                <Text letterSpacing="tight">Create New User</Text>
              </HStack>
            </DialogTitle>
          </DialogHeader>

          <DialogBody py={8}>
            <Stack gap={6}>
              <Field 
                label="Username" 
                invalid={!!errors.username} 
                errorText={errors.username?.message}
                helperText="How the user will be identified in the system"
              >
                <Input {...register("username")} placeholder="e.g. John Doe" />
              </Field>

              <Field label="Email Address" invalid={!!errors.email} errorText={errors.email?.message}>
                <Input {...register("email")} type="email" placeholder="john@company.com" />
              </Field>

              <Field label="Password" invalid={!!errors.password} errorText={errors.password?.message}>
                <Input {...register("password")} type="password" placeholder="••••••••" />
              </Field>

              <Field label="System Role" invalid={!!errors.role} errorText={errors.role?.message}>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("role")} bg="bg.muted">
                    <option value="USER">User (Standard Access)</option>
                    <option value="ADMIN">Admin (Full Control)</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter borderTopWidth="1px" borderColor="border.subtle" gap={3} bg="bg.canvas/50" py={4}>
            <DialogActionTrigger asChild>
              <Button variant="ghost" disabled={isPending}>
                <LuX /> Cancel
              </Button>
            </DialogActionTrigger>
            
            <Button 
              type="submit" 
              colorPalette="brand" 
              loading={isPending}
              px={8}
            >
              <LuCheck /> Create Account
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};