/**
 * @module AuditLogsPage
 * Responsive administrative view for system action tracking (Accounting).
 */

import {
  Box,
  Container,
  Heading,
  Table,
  Text,
  Badge,
  Spinner,
  Center,
  Alert,
  Stack,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { LuHistory, LuCircleAlert, LuShieldCheck } from "react-icons/lu";
import { useAuditLogs } from "@/services/hooks/user-hooks/use-audit-logs";
import { type AuditAction } from "@crm/shared/schemas/audit.schema.js";

/**
 * Maps audit actions to visual badge colors for quick scanning.
 */
const getActionStatus = (action: AuditAction) => {
  const map: Record<AuditAction, { color: string; label: string }> = {
    USER_LOGIN: { color: "blue", label: "Login" },
    USER_LOGOUT: { color: "gray", label: "Logout" },
    USER_CREATE: { color: "green", label: "Create" },
    USER_UPDATE: { color: "orange", label: "Update" },
    USER_DELETE: { color: "red", label: "Delete" },
    ROLE_CHANGE: { color: "purple", label: "Role Change" },
  };
  return map[action] || { color: "teal", label: action };
};

export const AuditLogsPage = () => {
  const { data: logs, isLoading, isError, error } = useAuditLogs();

  // 1. Loading State (Centered Spinner)
  if (isLoading) {
    return (
      <Center h="60vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.600" borderWidth="4px" />
          <Text color="fg.muted" fontWeight="medium">
            Loading audit history...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 2. Error State (Responsive Alert)
  if (isError) {
    const message = (error as any)?.response?.data?.error || "Access denied or server error";
    return (
      <Container maxW="6xl" py={10}>
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator>
            <LuCircleAlert />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Synchronization Failed</Alert.Title>
            <Alert.Description>{message}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }}>
      <Stack gap={6}>
        {/* Responsive Header Section */}
        <Stack
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "flex-start", sm: "flex-end" }}
          gap={4}
        >
          <Stack gap={1}>
            <HStack color="blue.600" gap={2}>
              <Icon as={LuShieldCheck} />
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Security Audit
              </Text>
            </HStack>
            <Heading size={{ base: "xl", md: "2xl" }}>System Logs</Heading>
            <Text color="fg.muted" fontSize="sm">
              Real-time trail of administrative actions and user sessions.
            </Text>
          </Stack>

          <Badge variant="subtle" size="lg" colorPalette="blue" borderRadius="md">
            {logs?.length || 0} Records Found
          </Badge>
        </Stack>

        {/* Adaptive Table Container */}
        <Box
          borderWidth="1px"
          borderRadius="xl"
          bg="bg.panel"
          shadow="sm"
          overflowX="auto" // Allows horizontal scroll on very small screens
        >
          <Table.Root size="md" variant="line" stickyHeader>
            <Table.Header bg="bg.muted">
              <Table.Row>
                <Table.ColumnHeader whiteSpace="nowrap">Time</Table.ColumnHeader>
                <Table.ColumnHeader>Operator</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
                {/* Hide technical IDs on mobile to save space */}
                <Table.ColumnHeader hideBelow="md">Target Entity</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" hideBelow="sm">
                  Details
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {logs?.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py={12}>
                    <Icon as={LuHistory} boxSize={8} color="fg.muted" mb={2} />
                    <Text color="fg.muted">No audit records found in the system.</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                logs?.map((log) => {
                  const status = getActionStatus(log.action);
                  return (
                    <Table.Row key={log.id} _hover={{ bg: "bg.subtle" }}>
                      <Table.Cell whiteSpace="nowrap" fontSize="xs">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        <Text as="span" display="block" color="fg.muted" fontSize="10px">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Text fontWeight="bold" fontSize="sm" truncate maxW="120px">
                          {log.username}
                        </Text>
                      </Table.Cell>

                      <Table.Cell>
                        <Badge colorPalette={status.color} variant="solid" size="xs">
                          {status.label}
                        </Badge>
                      </Table.Cell>

                      <Table.Cell hideBelow="md" fontFamily="mono" fontSize="xs" color="fg.muted">
                        {log.targetId ? log.targetId.split("-")[0] + "..." : "—"}
                      </Table.Cell>

                      <Table.Cell textAlign="right" hideBelow="sm">
                        <Badge variant="outline" size="xs">
                          RAW
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    </Container>
  );
};