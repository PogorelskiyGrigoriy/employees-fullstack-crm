/**
 * @module UserTable
 * Updated: Action callbacks now include username for zero-fetch modals.
 */

import { Table, Badge, HStack, IconButton, Box } from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import type { User } from "@crm/shared/schemas/auth.schema.js";

interface UserTableProps {
  readonly users: User[];
  readonly onEdit: (id: string) => void;
  readonly onDelete: (id: string, username: string) => void; 
}

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => (
  <Box 
    borderWidth="1px" 
    borderColor="border.subtle" 
    borderRadius="xl" 
    overflow="hidden" 
    shadow="sm" 
    bg="bg.panel"
  >
    <Table.Root size="md" variant="line">
      <Table.Header bg="bg.muted">
        <Table.Row>
          <Table.ColumnHeader>Username</Table.ColumnHeader>
          <Table.ColumnHeader>Email</Table.ColumnHeader>
          <Table.ColumnHeader>Role</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id} _hover={{ bg: "bg.subtle" }}>
            <Table.Cell fontWeight="bold">{user.username}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              <Badge colorPalette={user.role === "ADMIN" ? "purple" : "gray"}>
                {user.role}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <HStack gap="2" justify="flex-end">
                <IconButton 
                  aria-label="Edit user" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(user.id)}
                >
                  <LuPencil />
                </IconButton>
                
                <IconButton 
                  aria-label="Delete user" 
                  variant="ghost" 
                  size="sm" 
                  colorPalette="red"
                  onClick={() => onDelete(user.id, user.username)} 
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  </Box>
);