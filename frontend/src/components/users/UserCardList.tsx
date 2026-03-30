/**
 * @module UserCardList
 * Mobile-optimized user cards with action callbacks for CRUD.
 */

import { Box, Stack, HStack, Text, Badge, Button, Spacer } from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu"; 
import type { User } from "@crm/shared/schemas/auth.schema.js";

interface UserCardListProps {
  readonly users: User[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

export const UserCardList = ({ users, onEdit, onDelete }: UserCardListProps) => (
  <Stack gap="4">
    {users.map((user) => (
      <Box 
        key={user.id} 
        p="4" 
        bg="bg.panel" 
        borderRadius="xl" 
        borderWidth="1px" 
        shadow="sm"
      >
        <HStack align="flex-start" mb="2">
          <Stack gap="0">
            <Text fontWeight="bold" fontSize="lg">{user.username}</Text>
            <Text fontSize="xs" color="fg.muted">{user.email}</Text>
          </Stack>
          <Spacer />
          <Badge colorPalette={user.role === "ADMIN" ? "purple" : "gray"} size="sm">
            {user.role}
          </Badge>
        </HStack>
        
        <HStack borderTopWidth="1px" pt="3" mt="3" gap="4">
          {/* 2. Привязываем клик к onEdit */}
          <Button 
            size="sm" 
            variant="outline" 
            flex="1"
            onClick={() => onEdit(user.id)}
          >
            <LuPencil />
            Edit
          </Button>
          
          {/* 3. Привязываем клик к onDelete */}
          <Button 
            size="sm" 
            variant="outline" 
            colorPalette="red" 
            flex="1"
            onClick={() => onDelete(user.id)}
          >
            <LuTrash2 />
            Delete
          </Button>
        </HStack>
      </Box>
    ))}
  </Stack>
);