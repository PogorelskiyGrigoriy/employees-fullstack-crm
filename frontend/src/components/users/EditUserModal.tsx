/**
 * @module EditUserModal
 * Adaptive modal for updating user profiles.
 * Implements data pre-fetching and responsive full-screen/centered layouts.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button, 
  Stack, 
  Input, 
  NativeSelect, 
  DialogRoot, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogBody, 
  DialogFooter, 
  DialogActionTrigger,
  DialogCloseTrigger,
  Spinner,
  Center,
  Text
} from "@chakra-ui/react";
import { LuUserCog, LuX, LuSave } from "react-icons/lu";

import { Field } from "@/components/ui/field";
import { updateUserSchema, type UpdateUserDto } from "@crm/shared/schemas/auth.schema.js";
import { useUser, useUpdateUser } from "@/services/hooks/user-hooks/use-users";

interface EditUserModalProps {
  userId: string | null;
  onOpenChange: (details: { open: boolean }) => void;
}

export const EditUserModal = ({ userId, onOpenChange }: EditUserModalProps) => {
  // 1. Data Fetching & Mutations
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

  // 2. Effect: Sync form state with fetched data
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

  const isOpen = !!userId;

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={onOpenChange}
      size={{ base: "full", md: "md" }} // ADAPTIVE RULE: Fullscreen on mobile
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader borderBottomWidth="1px">
            <DialogTitle>
              <Stack direction="row" align="center" gap={2}>
                <LuUserCog />
                Edit User Account
              </Stack>
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
                  helperText="User's display name in the system"
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
                
                <Text fontSize="xs" color="fg.muted" fontStyle="italic">
                  * Password changes should be handled through the security portal.
                </Text>
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
              disabled={!isDirty || isLoading} // Disable if no changes made
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