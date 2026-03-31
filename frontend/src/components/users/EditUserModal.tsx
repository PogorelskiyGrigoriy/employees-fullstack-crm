/**
 * @module EditUserModal
 * Refactored to align with the "Midnight Slate" design system.
 * Optimized: Uses existing user data from props and semantic tokens.
 */

import { useEffect } from "react";
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
import { LuUserCog, LuX, LuSave } from "react-icons/lu";

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
import { updateUserSchema, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { useUpdateUser } from "@/services/hooks/user-hooks/use-users";
import type { User } from "@crm/shared/schemas/auth.schema.js";

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
    <DialogRoot 
      open={!!user} 
      onOpenChange={onOpenChange}
      size={{ base: "full", md: "md" }}
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent 
        bg="bg.panel" 
        borderRadius="2xl" 
        shadow="2xl" 
        borderWidth="1px" 
        borderColor="border.subtle"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
            <DialogTitle>
              <HStack gap={3}>
                <Icon as={LuUserCog} color="brand.500" />
                <Text letterSpacing="tight">Edit User Account</Text>
              </HStack>
            </DialogTitle>
          </DialogHeader>

          <DialogBody py={8}>
            <Stack gap={6}>
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
                  <NativeSelect.Field {...register("role")} bg="bg.muted">
                    <option value="USER">User (Standard Access)</option>
                    <option value="ADMIN">Admin (Full Control)</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter 
            borderTopWidth="1px" 
            borderColor="border.subtle" 
            gap={3} 
            bg="bg.canvas/50" 
            py={4}
          >
            <DialogActionTrigger asChild>
              <Button variant="ghost" disabled={isUpdating}>
                <LuX /> Cancel
              </Button>
            </DialogActionTrigger>
            
            <Button 
              type="submit" 
              colorPalette="brand" 
              loading={isUpdating} 
              disabled={!isDirty}
              px={8}
            >
              <LuSave /> Save Changes
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};