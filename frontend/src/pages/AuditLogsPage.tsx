/**
 * @module AuditLogsPage
 * Administrative view for monitoring system-wide actions (Accounting layer).
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
  Icon
} from "@chakra-ui/react";
import { LuHistory, LuCircleAlert } from "react-icons/lu";

import { useAuditLogs } from "@/services/hooks/user-hooks/use-audit-logs";
import type { AuditAction } from "@crm/shared/schemas/audit.schema.js";

/**
 * Helper to stylize actions for better scanability.
 */
const getActionBadgeColor = (action: AuditAction) => {
  switch (action) {
    case 'USER_LOGIN': return 'blue';
    case 'USER_LOGOUT': return 'gray';
    case 'USER_DELETE': return 'red';
    case 'USER_CREATE': return 'green';
    case 'USER_UPDATE': return 'orange';
    default: return 'teal';
  }
};

export const AuditLogsPage = () => {
  const { data: logs, isLoading, isError, error } = useAuditLogs();

  // 1. Loading State
  if (isLoading) {
    return (
      <Center h="60vh">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.500" />
          <Text color="fg.muted">Fetching audit trail...</Text>
        </VStack>
      </Center>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <Container maxW="6xl" py={8}>
        <Alert.Root status="error" variant="subtle">
          <Alert.Indicator>
            <LuCircleAlert />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Title>Failed to load logs</Alert.Title>
            <Alert.Description>
              {(error as any)?.response?.data?.error || "Check your administrative permissions."}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <Stack gap={6}>
        {/* Header Section */}
        <HStack justify="space-between" align="flex-end">
          <Stack gap={1}>
            <HStack color="blue.600">
              <Icon as={LuHistory} />
              <Text fontSize="sm" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                Accounting Layer
              </Text>
            </HStack>
            <Heading size="2xl">Audit Trail</Heading>
            <Text color="fg.muted">Complete history of administrative and user actions.</Text>
          </Stack>
          
          <Badge variant="subtle" size="lg" colorPalette="blue">
            Total Records: {logs?.length || 0}
          </Badge>
        </HStack>

        {/* Logs Table */}
        <Box 
          borderWidth="1px" 
          borderRadius="xl" 
          overflow="hidden" 
          bg="bg.panel" 
          shadow="sm"
        >
          <Table.Root size="md" variant="line" stickyHeader>
            <Table.Header bg="bg.muted">
              <Table.Row>
                <Table.ColumnHeader w="200px">Timestamp</Table.ColumnHeader>
                <Table.ColumnHeader>User</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
                <Table.ColumnHeader>Target ID</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Metadata</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {logs?.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center" py={10} color="fg.muted">
                    No actions recorded yet.
                  </Table.Cell>
                </Table.Row>
              ) : (
                logs?.map((log) => (
                  <Table.Row key={log.id} _hover={{ bg: "bg.subtle" }} transition="background 0.2s">
                    <Table.Cell fontSize="xs" fontWeight="medium" whiteSpace="nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Stack gap={0}>
                        <Text fontWeight="bold" fontSize="sm">{log.username}</Text>
                        <Text fontSize="2xs" color="fg.muted">ID: {log.userId.slice(0, 8)}...</Text>
                      </Stack>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Badge colorPalette={getActionBadgeColor(log.action)} variant="solid" size="sm">
                        {log.action.replace('_', ' ')}
                      </Badge>
                    </Table.Cell>
                    
                    <Table.Cell fontSize="xs" fontFamily="mono" color="fg.subtle">
                      {log.targetId || "—"}
                    </Table.Cell>

                    <Table.Cell textAlign="right">
                      {log.metadata ? (
                        <Badge variant="outline" size="xs">Details</Badge>
                      ) : "—"}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </Stack>
    </Container>
  );
};

// Не забудь импортировать VStack в начале, если Chakra 3.x его требует отдельно
import { VStack } from "@chakra-ui/react";