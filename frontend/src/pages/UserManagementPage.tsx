/**
 * @module UserManagementPage
 * Administrative hub for managing system users. 
 * Orchestrates Desktop Table and Mobile Card views.
 */

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

export const UserManagementPage = () => {
  const { data: users, isLoading, isError, error } = useUsers();

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

          {/* Исправленная кнопка для Chakra 3.x */}
          <Button 
            colorPalette="blue" 
            size="lg" 
            variant="solid"
            onClick={() => {
              console.log("Open CreateUserModal"); 
              /* Будет реализовано в Шаге 4 */
            }}
          >
            <LuUserPlus />
            Create User
          </Button>
        </Stack>

        {/* Responsive Content Switch */}
        {users && users.length > 0 ? (
          <>
            {/* DESKTOP VIEW: High-density Table */}
            <Box display={{ base: "none", md: "block" }}>
              <UserTable users={users} />
            </Box>

            {/* MOBILE VIEW: Touch-friendly Card List */}
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
    </Container>
  );
};