/**
 * @module CreateUserModal
 * Refactored to use adaptive AppDialog atoms.
 * Aligns with the "Midnight Slate" design system and handles mobile fullscreen automatically.
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Field } from "@/components/ui/field";
import { createUserSchema, type CreateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { useCreateUser } from "@/services/hooks/user-hooks/use-users";

// Наши новые атомы
import { AppDialogRoot, AppDialogContent } from "@/components/shared/atoms/AppDialog";

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
    /* 1. AppDialogRoot: теперь принимает size="md", так как форма требует больше места, чем алерт удаления */
    <AppDialogRoot 
      open={isOpen} 
      onOpenChange={onOpenChange}
      size="md" 
    >
      /* 2. AppDialogContent: инкапсулирует Portal, Positioner и декоративные элементы */
      <AppDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
            <DialogTitle>
              <HStack gap={3}>
                <Icon as={LuUserPlus} color="brand.500" />
                <Text letterSpacing="tight" fontWeight="bold">Create New User</Text>
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
                  <NativeSelect.Field 
                    {...register("role")} 
                    bg="bg.muted"
                    borderWidth="1px"
                    borderColor="border.subtle"
                  >
                    <option value="USER">User (Standard Access)</option>
                    <option value="ADMIN">Admin (Full Control)</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter borderTopWidth="1px" borderColor="border.subtle" gap={3} bg="bg.canvas/50" py={4}>
            <DialogActionTrigger asChild>
              <Button variant="subtle" colorPalette="gray" disabled={isPending}>
                <LuX /> Cancel
              </Button>
            </DialogActionTrigger>
            
            <Button 
              type="submit" 
              colorPalette="brand" 
              loading={isPending}
              px={8}
              shadow="md"
            >
              <LuCheck /> Create Account
            </Button>
          </DialogFooter>
        </form>
        {/* DialogCloseTrigger удален, так как он встроен в AppDialogContent */}
      </AppDialogContent>
    </AppDialogRoot>
  );
};