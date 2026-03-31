/**
 * @module EditUserModal
 * Updated: Using local Dialog snippets for proper layering and visibility.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button, 
  Stack, 
  Input, 
  NativeSelect, 
  Spinner, 
  Center, 
  Text,
  HStack
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
import { useUser, useUpdateUser } from "@/services/hooks/user-hooks/use-users";

interface EditUserModalProps {
  userId: string | null;
  onOpenChange: (details: { open: boolean }) => void;
}

export const EditUserModal = ({ userId, onOpenChange }: EditUserModalProps) => {
  const { data: user, isLoading, isError } = useUser(userId ?? undefined);
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
    if (!userId) return;
    update({ id: userId, data }, {
      onSuccess: () => onOpenChange({ open: false })
    });
  };

  return (
    <DialogRoot 
      open={!!userId} 
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
            {isLoading ? (
              <Center h="200px">
                <Spinner color="blue.500" />
              </Center>
            ) : isError ? (
              <Center h="200px">
                <Text color="red.500">Failed to load user data</Text>
              </Center>
            ) : (
              <Stack gap={5}>
                <Field 
                  label="Username" 
                  invalid={!!errors.username} 
                  errorText={errors.username?.message}
                >
                  <Input {...register("username")} />
                </Field>

                <Field 
                  label="Email Address" 
                  invalid={!!errors.email} 
                  errorText={errors.email?.message}
                >
                  <Input {...register("email")} type="email" />
                </Field>

                <Field 
                  label="System Role" 
                  invalid={!!errors.role} 
                  errorText={errors.role?.message}
                >
                  <NativeSelect.Root>
                    <NativeSelect.Field {...register("role")}>
                      <option value="USER">User (Standard Access)</option>
                      <option value="ADMIN">Admin (Full Control)</option>
                    </NativeSelect.Field>
                  </NativeSelect.Root>
                </Field>
              </Stack>
            )}
          </DialogBody>

          <DialogFooter borderTopWidth="1px" gap={3}>
            <DialogActionTrigger asChild>
              <Button variant="ghost" disabled={isUpdating}>
                <LuX /> Cancel
              </Button>
            </DialogActionTrigger>
            
            <Button 
              type="submit" 
              colorPalette="blue" 
              loading={isUpdating}
              disabled={!isDirty || isLoading}
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