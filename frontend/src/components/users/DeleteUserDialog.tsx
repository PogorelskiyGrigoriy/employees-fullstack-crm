/**
 * @module DeleteUserDialog
 * Confirmative destruction dialog for the "Midnight Slate" theme.
 * Zero-fetch implementation: uses data passed from the parent.
 */

import { Button, Text, HStack, Stack, Icon } from "@chakra-ui/react";
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

import { useDeleteUser } from "@/services/hooks/user-hooks/use-users";

interface DeleteUserDialogProps {
  user: { id: string; username: string } | null; 
  onOpenChange: (details: { open: boolean }) => void;
}

export const DeleteUserDialog = ({ user, onOpenChange }: DeleteUserDialogProps) => {
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = () => {
    if (!user) return;
    deleteUser(user.id, {
      onSuccess: () => onOpenChange({ open: false })
    });
  };

  return (
    <DialogRoot 
      open={!!user} 
      onOpenChange={onOpenChange}
      role="alertdialog"
      placement="center"
    >
      {/* 1. Themed Shell */}
      <DialogContent 
        bg="bg.panel" 
        borderRadius="2xl" 
        borderWidth="1px" 
        borderColor="red.500/20" // Subtle red border to indicate danger
        shadow="2xl"
      >
        <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={5}>
          <DialogTitle>
            <HStack gap={3} color="red.500">
              <Icon as={LuTriangleAlert} />
              <Text letterSpacing="tight">Confirm Deletion</Text>
            </HStack>
          </DialogTitle>
        </DialogHeader>

        <DialogBody py={8}>
          <Stack gap={5}>
            <Text fontSize="md">
              Are you sure you want to delete user <Text as="span" fontWeight="black" color="fg.emphasized">{user?.username}</Text>?
            </Text>
            
            {/* 2. Redesigned Warning Box for Dark Mode */}
            <HStack 
              gap={3}
              fontSize="sm" 
              color="red.200" 
              bg="red.500/10" 
              p={4} 
              borderRadius="xl" 
              borderLeftWidth="4px" 
              borderLeftColor="red.500"
            >
              <LuTriangleAlert size={20} />
              <Text>
                This action is <b>permanent</b> and will be logged in the system audit trail.
              </Text>
            </HStack>
          </Stack>
        </DialogBody>

        {/* 3. Themed Footer Actions */}
        <DialogFooter borderTopWidth="1px" borderColor="border.subtle" gap={3} bg="bg.canvas/50" py={4}>
          <DialogActionTrigger asChild>
            <Button variant="ghost" disabled={isPending}>
              Cancel
            </Button>
          </DialogActionTrigger>
          
          <Button 
            colorPalette="red" 
            loading={isPending}
            onClick={handleDelete}
            px={8}
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