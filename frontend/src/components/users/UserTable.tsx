/**
 * @module UserTable
 * Desktop view for identity management.
 * Refactored using AppBadge and ActionButton atoms for maximum consistency.
 */

import { Table, HStack, Text } from "@chakra-ui/react";
import type { User } from "@crm/shared/schemas/auth.schema.js";

import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { ActionButton } from "@/components/shared/atoms/ActionButton";

interface UserTableProps {
  readonly users: User[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string, username: string) => void; 
}

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => (
  <Table.Root size="md" variant="line" stickyHeader>
    <Table.Header bg="bg.muted">
      <Table.Row>
        <Table.ColumnHeader>Username</Table.ColumnHeader>
        <Table.ColumnHeader>Email</Table.ColumnHeader>
        <Table.ColumnHeader>Role</Table.ColumnHeader>
        <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {users.map((user) => (
        <Table.Row 
          key={user.id} 
          _hover={{ bg: "bg.subtle" }} 
          transition="background 0.2s"
        >
          {/* 1. Identity Cell */}
          <Table.Cell>
            <Text 
              fontWeight="bold" 
              color="fg.emphasized" 
              letterSpacing="tight"
            >
              {user.username}
            </Text>
          </Table.Cell>

          {/* 2. Contact Cell */}
          <Table.Cell color="fg.muted">
            {user.email}
          </Table.Cell>

          {/* 3. Role Cell: Logic encapsulated in AppBadge */}
          <Table.Cell>
            <AppBadge type="role" value={user.role} />
          </Table.Cell>

          {/* 4. Actions: Using standardized ActionButton atom */}
          <Table.Cell>
            <HStack gap="2" justify="flex-end">
              <ActionButton 
                actionType="edit" 
                onClick={() => onEdit(user.id)}
                label={`Edit ${user.username}`}
              />
              <ActionButton 
                actionType="delete" 
                onClick={() => onDelete(user.id, user.username)} 
                label={`Delete ${user.username}`}
              />
            </HStack>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);