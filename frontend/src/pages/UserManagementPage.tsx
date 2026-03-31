/**
 * @module UserManagementPage
 * Administrative hub for identity management.
 * Refactored using the Midnight Slate design system and shared organisms.
 */
import { useState } from "react";
import { Container, Box, Button } from "@chakra-ui/react";
import { LuUserPlus, LuUsers } from "react-icons/lu";

import { useUsers } from "@/services/hooks/user-hooks/use-users";
import { UserTable } from "@/components/users/UserTable";
import { UserCardList } from "@/components/users/UserCardList";
import { CreateUserModal } from "@/components/users/CreateUserModal";
import { EditUserModal } from "@/components/users/EditUserModal";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";

import { PageHeader } from "@/components/shared/molecules/PageHeader";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { RBACGuard } from "@/components/shared/organisms/RBACGuard";

import type { User } from "@crm/shared/schemas/auth.schema.js";

export const UserManagementPage = () => {
  const { data: users, isLoading, isError, error, refetch } = useUsers();
  
  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<{ id: string; username: string } | null>(null);

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }}>
      {/* 1. Page Header with Integrated RBAC for Action Button */}
      <PageHeader
        title="User Accounts"
        description="Manage system access, roles, and security credentials."
        icon={LuUsers}
        rightElement={
          <RBACGuard roles={["ADMIN"]}>
            <Button 
              colorPalette="brand" 
              size="lg" 
              onClick={() => setIsCreateOpen(true)}
              shadow="md"
            >
              <LuUserPlus /> Create User
            </Button>
          </RBACGuard>
        }
      />

      {/* 2. Centralized State Management (Loading, Error, Empty) */}
      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!users || users.length === 0}
        emptyMessage="No system users found"
        emptyDescription="Get started by creating the first administrator or manager account."
        onRetry={refetch}
      >
        {/* 3. Responsive Data Views */}
        <Box>
          {/* Desktop Table View inside AppPanel */}
          <Box display={{ base: "none", md: "block" }}>
            <AppPanel p={0} overflow="hidden">
              <UserTable
                users={users!}
                onEdit={(id) => setEditingUser(users?.find(u => u.id === id) ?? null)}
                onDelete={(id, username) => setDeletingUser({ id, username })}
              />
            </AppPanel>
          </Box>

          {/* Mobile Card View */}
          <Box display={{ base: "block", md: "none" }}>
            <UserCardList
              users={users!}
              onEdit={(id) => setEditingUser(users?.find(u => u.id === id) ?? null)}
              onDelete={(id, username) => setDeletingUser({ id, username })}
            />
          </Box>
        </Box>
      </DataStateWrapper>

      {/* --- Modals Layer (Logic preserved) --- */}
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

export default UserManagementPage;