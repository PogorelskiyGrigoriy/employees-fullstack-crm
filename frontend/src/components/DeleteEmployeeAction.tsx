/**
 * @module DeleteEmployeeAction
 * Confirmation dialog for employee deletion.
 * Refactored using ActionButton atom and Midnight Slate danger styles.
 */

import { useState } from "react";
import { Button, Text, HStack, Icon, Stack } from "@chakra-ui/react";
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
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDeleteEmployee } from "@/services/hooks/mutation-hooks/use-delete-employee";
import { ActionButton } from "@/components/shared/atoms/ActionButton";

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
    <DialogRoot 
      role="alertdialog" 
      placement="center" 
      open={open} 
      onOpenChange={(e) => setOpen(e.open)}
    >
      <DialogTrigger asChild>
        {/* 1. Using our new ActionButton atom instead of raw IconButton */}
        <ActionButton 
          actionType="delete" 
          disabled={isPending}
          label={`Delete employee ${name}`}
        />
      </DialogTrigger>
      
      <DialogContent 
        bg="bg.panel" 
        borderRadius="2xl" 
        borderWidth="1px" 
        borderColor="red.500/20" 
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
              Are you sure you want to delete <Text as="span" fontWeight="black" color="fg.emphasized">{name}</Text>? 
            </Text>

            {/* 2. Consistent danger warning box */}
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
              <Icon as={LuTriangleAlert} size="md" />
              <Text>
                This action is <b>permanent</b> and will immediately remove the record from the directory.
              </Text>
            </HStack>
          </Stack>
        </DialogBody>
        
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
            Delete Employee
          </Button>
        </DialogFooter>
        
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};