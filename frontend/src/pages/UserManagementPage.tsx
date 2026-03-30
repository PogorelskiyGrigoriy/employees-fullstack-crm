/**
 * @module UserManagementPage
 * Administrative hub for managing system users. 
 * Updated with CreateUserModal integration and state management.
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

export const UserManagementPage = () => {
  const { data: users, isLoading, isError, error } = useUsers();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 1. Loading State
  if (isLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.600" borderWidth="4px" />
      </Center>
    );
  }

  // 2. Error State
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
        {/* Header Section */}
        <Stack 
          direction={{ base: "column", sm: "row" }} 
          justify="space-between" 
          align={{ base: "flex-start", sm: "center" }}
          gap={4}
        >
          <Stack gap={1}>
            <HStack color="blue.600">
              <Icon as={LuUsers} />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Identity Management
              </Text>
            </HStack>
            <Heading size={{ base: "xl", md: "2xl" }}>User Accounts</Heading>
            <Text color="fg.muted" fontSize="sm">
              Manage system access, roles, and administrative permissions.
            </Text>
          </Stack>

          <Button 
            colorPalette="blue" 
            size="lg" 
            variant="solid"
            onClick={() => setIsCreateOpen(true)}
          >
            <LuUserPlus />
            Create User
          </Button>
        </Stack>

        {/* Content Section */}
        {users && users.length > 0 ? (
          <>
            <Box display={{ base: "none", md: "block" }}>
              <UserTable users={users} />
            </Box>

            <Box display={{ base: "block", md: "none" }}>
              <UserCardList users={users} />
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
    </Container>
  );
};