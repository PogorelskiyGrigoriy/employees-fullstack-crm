/**
 * @module UserManagementPage
 * Finalized with full CRUD state orchestration: Create, Edit, and Delete.
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

export const UserManagementPage = () => {
  const { data: users, isLoading, isError, error } = useUsers();
  
  // States for Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

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
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">Identity Management</Text>
            </HStack>
            <Heading size={{ base: "xl", md: "2xl" }}>User Accounts</Heading>
          </Stack>

          <Button colorPalette="blue" size="lg" onClick={() => setIsCreateOpen(true)}>
            <LuUserPlus /> Create User
          </Button>
        </Stack>

        {/* Content */}
        {users && users.length > 0 ? (
          <>
            <Box display={{ base: "none", md: "block" }}>
              <UserTable 
                users={users} 
                onEdit={setEditingUserId} 
                onDelete={setDeletingUserId}
              />
            </Box>

            <Box display={{ base: "block", md: "none" }}>
              <UserCardList 
                users={users} 
                onEdit={setEditingUserId} 
                onDelete={setDeletingUserId}
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
        userId={editingUserId} 
        onOpenChange={(e) => !e.open && setEditingUserId(null)} 
      />

      <DeleteUserDialog 
        userId={deletingUserId}
        onOpenChange={(e) => !e.open && setDeletingUserId(null)}
      />
    </Container>
  );
};