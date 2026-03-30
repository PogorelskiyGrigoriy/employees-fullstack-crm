/**
 * @module UserCardList
 * Updated for Chakra 3.x native button syntax.
 */

import { Box, Stack, HStack, Text, Badge, Button, Spacer } from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu"; 
import type { User } from "@crm/shared/schemas/auth.schema.js";

export const UserCardList = ({ users }: { users: User[] }) => (
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
          <Button size="sm" variant="outline" flex="1">
            <LuPencil />
            Edit
          </Button>
          
          <Button size="sm" variant="outline" colorPalette="red" flex="1">
            <LuTrash2 />
            Delete
          </Button>
        </HStack>
      </Box>
    ))}
  </Stack>
);