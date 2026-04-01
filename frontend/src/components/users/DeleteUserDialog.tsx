/**
 * @module DeleteUserDialog
 * Confirmative destruction dialog for the "Midnight Slate" theme.
 * Refactored: Uses AppDialog atoms, centered layout, and balanced actions.
 */

import { Button, Text, HStack, Stack, Box, VStack } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";

import {
  DialogActionTrigger,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Импортируем наши адаптивные атомы
import { AppDialogRoot, AppDialogContent } from "@/components/shared/atoms/AppDialog";
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
    /* 1. AppDialogRoot: обрабатывает состояние открытия и адаптивный размер (full на мобилках) */
    <AppDialogRoot 
      open={!!user} 
      onOpenChange={onOpenChange}
      role="alertdialog"
      size="sm"
    >
      {/* 2. AppDialogContent: добавляет Portal, тени и красную рамку для Danger-статуса */}
      <AppDialogContent borderColor="red.500/40">
        <DialogHeader borderBottomWidth="1px" borderColor="border.subtle">
          <DialogTitle color="red.500" textAlign="center" width="full" letterSpacing="tight">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        <DialogBody py={8}>
          <VStack gap={6} align="stretch" textAlign="center">
            <Box>
              <Text fontSize="md">
                Are you sure you want to delete user
              </Text>
              <Text fontSize="lg" fontWeight="black" color="fg.emphasized" mt={1}>
                {user?.username}
              </Text>
            </Box>
            
            {/* 3. Warning Box: без иконки, с исправленным переносом текста */}
            <HStack 
              gap={3} p={4} borderRadius="xl" bg="red.500/10" 
              borderLeftWidth="4px" borderLeftColor="red.500"
              textAlign="left"
              width="full"
            >
              <Text fontSize="sm" color="red.100" flex="1" whiteSpace="normal" lineHeight="tall">
                This action is <b>permanent</b> and will be logged in the system audit trail.
              </Text>
            </HStack>
          </VStack>
        </DialogBody>

        {/* 4. Footer: центрированные кнопки с равным весом (flex=1) */}
        <DialogFooter 
          borderTopWidth="1px" 
          borderColor="border.subtle" 
          gap={3} 
          justifyContent="center" 
          px={6}
          py={4}
        >
          <DialogActionTrigger asChild>
            <Button variant="subtle" colorPalette="gray" disabled={isPending} flex="1">
              Cancel
            </Button>
          </DialogActionTrigger>
          
          <Button 
            colorPalette="red" 
            loading={isPending}
            onClick={handleDelete}
            flex="1"
          >
            Delete Account
          </Button>
        </DialogFooter>
      </AppDialogContent>
    </AppDialogRoot>
  );
};