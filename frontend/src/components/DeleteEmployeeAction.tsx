/**
 * @module DeleteEmployeeAction
 * Confirmation dialog for employee deletion.
 * Fixed: Removed trash icon from the delete button in the footer for cleaner aesthetics.
 * Refactored using AppDialogContent for consistent depth and ActionButton for interactions.
 */

import { useState } from "react";
import { Button, Text, HStack, Stack, Box, VStack } from "@chakra-ui/react";
// Убираем импорт LuTrash2, так как он больше не используется в этом компоненте
import {
  DialogActionTrigger,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/chakra/dialog";

// Импортируем наши атомы
import { AppDialogContent, AppDialogRoot } from "@/shared/ui/atoms/AppDialog";
import { useDeleteEmployee } from "@/services/hooks/mutation-hooks/use-delete-employee";
import { ActionButton } from "@/shared/ui/atoms/ActionButton";

interface Props {
  id: string;
  name: string;
}

export const DeleteEmployeeAction = ({ id, name }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate: deleteEmp, isPending } = useDeleteEmployee();

  const handleDelete = () => {
    deleteEmp(id, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <AppDialogRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="sm">
      <DialogTrigger asChild>
        <ActionButton actionType="delete" disabled={isPending} label={`Delete ${name}`} />
      </DialogTrigger>
      
      {/* Используем AppDialogContent. Переопределяем borderColor на красный для Danger-статуса */}
      <AppDialogContent borderColor="red.500/40">
        <DialogHeader borderBottomWidth="1px" borderColor="border.subtle">
          {/* Заголовок: Центрирование */}
          <DialogTitle color="red.500" textAlign="center" width="full" letterSpacing="tight">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        
        {/* Тело диалога: Центрирование контента */}
        <DialogBody py={8}>
          <VStack gap={6} align="stretch" textAlign="center">
            <Box>
              <Text fontSize="md">
                Are you sure you want to delete
              </Text>
              <Text fontSize="lg" fontWeight="black" color="fg.emphasized" mt={1}>
                {name}
              </Text>
            </Box>

            {/* Danger warning box: Исправление Overflow и центрирование */}
            <HStack 
              gap={3} p={4} borderRadius="xl" bg="red.500/10" 
              borderLeftWidth="4px" borderLeftColor="red.500"
              align="flex-start"
              textAlign="left"
              width="full"
            >
              <Text fontSize="sm" color="red.100" flex="1" whiteSpace="normal" lineHeight="tall">
                This action is permanent and will immediately remove the record from the directory.
              </Text>
            </HStack>
          </VStack>
        </DialogBody>
        
        {/* Футер: Кнопки отцентрированы, имеют равный вес (flex=1) */}
        <DialogFooter borderTopWidth="1px" borderColor="border.subtle" gap={3} justifyContent="center" px={6}>
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
            {/* КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Удалена строка с <LuTrash2 /> */}
            Delete Employee
          </Button>
        </DialogFooter>
      </AppDialogContent>
    </AppDialogRoot>
  );
};