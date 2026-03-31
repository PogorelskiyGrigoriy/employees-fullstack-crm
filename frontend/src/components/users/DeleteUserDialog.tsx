/**
 * @module DeleteUserDialog
 * Updated: Using local Dialog snippets for proper alerts.
 */

import { 
  Button, 
  Text,
  Spinner,
  Center,
  HStack,
  Stack
} from "@chakra-ui/react";
import { LuTrash2, LuTriangleAlert } from "react-icons/lu";

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

import { useDeleteUser, useUser } from "@/services/hooks/user-hooks/use-users";

interface DeleteUserDialogProps {
  userId: string | null;
  onOpenChange: (details: { open: boolean }) => void;
}

export const DeleteUserDialog = ({ userId, onOpenChange }: DeleteUserDialogProps) => {
  const { data: user, isLoading } = useUser(userId ?? undefined);
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = () => {
    if (!userId) return;
    deleteUser(userId, {
      onSuccess: () => onOpenChange({ open: false })
    });
  };

  return (
    <DialogRoot 
      open={!!userId} 
      onOpenChange={onOpenChange}
      role="alertdialog"
      placement="center"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle color="red.600">
            <HStack gap={2}>
              <LuTriangleAlert />
              Confirm Deletion
            </HStack>
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          {isLoading ? (
            <Center py={4}><Spinner size="sm" /></Center>
          ) : (
            <Stack gap={3}>
              <Text>
                Are you sure you want to delete user <b>{user?.username}</b>?
              </Text>
              <Text 
                fontSize="xs" 
                color="fg.muted" 
                bg="red.50" 
                p={2} 
                borderRadius="md" 
                borderLeftWidth="4px" 
                borderLeftColor="red.500"
              >
                This action is permanent and will be logged in the system audit trail.
              </Text>
            </Stack>
          )}
        </DialogBody>

        <DialogFooter gap={3}>
          <DialogActionTrigger asChild>
            <Button variant="ghost" disabled={isPending}>Cancel</Button>
          </DialogActionTrigger>
          <Button 
            colorPalette="red" 
            loading={isPending}
            onClick={handleDelete}
          >
            <LuTrash2 />
            Delete Account
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};