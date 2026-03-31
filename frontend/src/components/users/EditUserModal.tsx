/**
 * @module EditUserModal
 * Optimized: Uses existing user data from props to avoid redundant GET requests.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, Input, NativeSelect, HStack } from "@chakra-ui/react";
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
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottomWidth="1px">
            <DialogTitle>
              <HStack gap={2}>
                <LuUserCog />
                Edit User Account
              </HStack>
            </DialogTitle>
          </DialogHeader>

          <DialogBody py={6}>
            <Stack gap={5}>
              <Field label="Username" invalid={!!errors.username} errorText={errors.username?.message}>
                <Input {...register("username")} />
              </Field>

              <Field label="Email Address" invalid={!!errors.email} errorText={errors.email?.message}>
                <Input {...register("email")} type="email" />
              </Field>

              <Field label="System Role" invalid={!!errors.role} errorText={errors.role?.message}>
                <NativeSelect.Root>
                  <NativeSelect.Field {...register("role")}>
                    <option value="USER">User (Standard Access)</option>
                    <option value="ADMIN">Admin (Full Control)</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field>
            </Stack>
          </DialogBody>

          <DialogFooter borderTopWidth="1px" gap={3}>
            <DialogActionTrigger asChild>
              <Button variant="ghost" disabled={isUpdating}><LuX /> Cancel</Button>
            </DialogActionTrigger>
            <Button type="submit" colorPalette="blue" loading={isUpdating} disabled={!isDirty}>
              <LuSave /> Save Changes
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};