/**
 * @module UserManagementPage
 * Finalized administrative hub.
 * Optimized to pass full context to modals, eliminating 404s and redundant GETs.
 */

import { useState } from "react";
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  HStack, 
  Icon, 
  Stack, 
  Text, 
  Spinner, 
  Center,
  VStack
} from "@chakra-ui/react";
import { LuUserPlus, LuUsers } from "react-icons/lu";

import { useUsers } from "@/services/hooks/user-hooks/use-users";
import { UserTable } from "@/components/users/UserTable";
import { UserCardList } from "@/components/users/UserCardList";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { EditUserModal } from "@/components/users/EditUserModal";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import type { User } from "@crm/shared/schemas/auth.schema.js";

export const UserManagementPage = () => {
  const { data: users, isLoading, isError, error } = useUsers(); 
  const [isCreateOpen, setIsCreateOpen] = useState(false); 
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<{ id: string; username: string } | null>(null);

  if (isLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.600" borderWidth="4px" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center h="60vh">
        <VStack gap="2">
          <Text color="red.500" fontWeight="bold">Error loading user database</Text>
          <Text fontSize="sm" color="fg.muted">{(error as any)?.message}</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }}>
      <Stack gap={8}>
        {/* Header */}
        <Stack direction={{ base: "column", sm: "row" }} justify="space-between" align={{ base: "flex-start", sm: "center" }} gap={4}>
          <Stack gap={1}>
            <HStack color="blue.600">
              <Icon as={LuUsers} />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Identity Management
              </Text>
            </HStack>
            <Heading size={{ base: "xl", md: "2xl" }}>User Accounts</Heading>
          </Stack>

          <Button colorPalette="blue" size="lg" onClick={() => setIsCreateOpen(true)}>
            <LuUserPlus /> Create User
          </Button>
        </Stack>

        {/* Content Section */}
        {users && users.length > 0 ? (
          <>
            <Box display={{ base: "none", md: "block" }}>
              <UserTable 
                users={users} 
                onEdit={(id) => setEditingUser(users.find(u => u.id === id) ?? null)} 
                onDelete={(id, username) => setDeletingUser({ id, username })}
              />
            </Box>

            <Box display={{ base: "block", md: "none" }}>
              <UserCardList 
                users={users} 
                onEdit={(id) => setEditingUser(users.find(u => u.id === id) ?? null)} 
                onDelete={(id, username) => setDeletingUser({ id, username })}
              />
            </Box>
          </>
        ) : (
          <Center h="200px" borderWidth="1px" borderRadius="xl" borderStyle="dashed">
            <Text color="fg.muted">No system users found.</Text>
          </Center>
        )}
      </Stack>

      {/* --- Modals Layer --- */}
      
      <CreateUserModal 
        isOpen={isCreateOpen} 
        onOpenChange={(e) => setIsCreateOpen(e.open)} 
      />

      <EditUserModal 
        user={editingUser} 
        onOpenChange={(e) => !e.open && setEditingUser(null)} 
      />

      <DeleteUserDialog 
        user={deletingUser}
        onOpenChange={(e) => !e.open && setDeletingUser(null)}
      />
    </Container>
  );
};