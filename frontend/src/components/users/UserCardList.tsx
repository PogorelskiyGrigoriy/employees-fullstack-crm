/**
 * @module UserCardList
 * Mobile-optimized view for identity management.
 * Refactored using AppPanel and AppBadge for consistent visual language.
 */

import { Stack, HStack, Text, Spacer, Button, Icon } from "@chakra-ui/react";
import { LuPencil, LuTrash2, LuMail } from "react-icons/lu"; 
import type { User } from "@crm/shared/schemas/auth.schema.js";

import { AppPanel } from "@/shared/ui/atoms/AppPanel";
import { AppBadge } from "@/shared/ui/atoms/AppBadge";

interface UserCardListProps {
  readonly users: User[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string, username: string) => void;
}

export const UserCardList = ({ users, onEdit, onDelete }: UserCardListProps) => (
  <Stack gap={4}>
    {users.map((user) => (
      <AppPanel 
        key={user.id} 
        p={4} 
        shadow="md"
        _active={{ scale: 0.98 }} // Tactile feedback for mobile
        transition="transform 0.1s"
      >
        {/* Header Section */}
        <HStack align="flex-start" mb={3}>
          <Stack gap={0}>
            <Text 
              fontWeight="bold" 
              fontSize="md" 
              color="fg.emphasized"
              letterSpacing="tight"
            >
              {user.username}
            </Text>
            <HStack gap={1} color="fg.muted">
              <Icon as={LuMail} boxSize={3} />
              <Text fontSize="xs">{user.email}</Text>
            </HStack>
          </Stack>
          
          <Spacer />
          
          {/* Smart Badge: encapsulates color logic for "ADMIN" vs "USER" */}
          <AppBadge type="role" value={user.role} size="sm" variant="subtle" />
        </HStack>
        
        {/* Actions Section */}
        <HStack borderTopWidth="1px" borderColor="border.subtle" pt={3} mt={1} gap={3}>
          <Button 
            size="sm" 
            variant="ghost" 
            flex="1"
            colorPalette="brand" // Indigo accent
            onClick={() => onEdit(user.id)}
          >
            <LuPencil />
            Edit
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            colorPalette="red" 
            flex="1"
            onClick={() => onDelete(user.id, user.username)} 
          >
            <LuTrash2 />
            Delete
          </Button>
        </HStack>
      </AppPanel>
    ))}
  </Stack>
);