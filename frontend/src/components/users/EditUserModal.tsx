/**
 * @module EditUserModal
 * Refactored to use adaptive AppDialog atoms.
 * Optimized: Uses centralized logic for positioning, shadows, and mobile responsiveness.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button,  
  Input, 
  NativeSelect, 
  HStack, 
  Text, 
  Icon,
  VStack
} from "@chakra-ui/react";
import { LuUserCog, LuX, LuSave } from "react-icons/lu";

import {
  DialogActionTrigger,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/chakra/dialog";

import { Field } from "@/shared/ui/chakra/field";
import { updateUserSchema, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { useUpdateUser } from "@/services/hooks/user-hooks/use-users";
import type { User } from "@crm/shared/schemas/auth.schema.js";

// Наши адаптивные атомы
import { AppDialogRoot, AppDialogContent } from "@/shared/ui/atoms/AppDialog";

interface EditUserModalProps {
  user: User | null; 
  onOpenChange: (details: { open: boolean }) => void;
}

export const EditUserModal = ({ user, onOpenChange }: EditUserModalProps) => {
  const { mutate: update, isPending: isUpdating } = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<UpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
  });

  // Hydrate form when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        role: user.role
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UpdateUserDto) => {
    if (!user) return;
    update({ id: user.id, data }, {
      onSuccess: () => onOpenChange({ open: false })
    });
  };

  return (
    /* 1. AppDialogRoot: обрабатывает "!!user" как состояние открытия и адаптирует размер */
    <AppDialogRoot 
      open={!!user} 
      onOpenChange={onOpenChange}
      size="md"
    >
      /* 2. AppDialogContent: обеспечивает Portal, Positioner и встроенный крестик закрытия */
      <AppDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
            <DialogTitle>
              <HStack gap={3}>
                <Icon as={LuUserCog} color="brand.500" />
                <Text letterSpacing="tight" fontWeight="bold">Edit User Account</Text>
              </HStack>
            </DialogTitle>
          </DialogHeader>

          <DialogBody py={8}>
            <VStack gap={6} align="stretch">
              <Field 
                label="Username" 
                invalid={!!errors.username} 
                errorText={errors.username?.message}
              >
                <Input {...register("username")} variant="subtle" />
              </Field>

              <Field 
                label="Email Address" 
                invalid={!!errors.email} 
                errorText={errors.email?.message}
              >
                <Input {...register("email")} type="email" variant="subtle" />
              </Field>

              <Field 
                label="System Role" 
                invalid={!!errors.role} 
                errorText={errors.role?.message}
              >
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
            </VStack>
          </DialogBody>

          <DialogFooter 
            borderTopWidth="1px" 
            borderColor="border.subtle" 
            gap={3} 
            justifyContent="center" 
            py={4}
            px={6}
          >
            <DialogActionTrigger asChild>
              <Button variant="subtle" colorPalette="gray" disabled={isUpdating} flex="1">
                <LuX /> Cancel
              </Button>
            </DialogActionTrigger>
            
            <Button 
              type="submit" 
              colorPalette="brand" 
              loading={isUpdating} 
              disabled={!isDirty}
              flex="1"
              shadow="md"
            >
              <LuSave /> Save Changes
            </Button>
          </DialogFooter>
        </form>
      </AppDialogContent>
    </AppDialogRoot>
  );
};