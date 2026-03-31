/**
 * @module AuditLogsPage
 * Administrative view for system action tracking.
 * Refactored using the "Midnight Slate" design system and shared organisms.
 */
import { Container, Table, Text } from "@chakra-ui/react";
import { LuShieldCheck } from "react-icons/lu";

import { useAuditLogs } from "@/services/hooks/user-hooks/use-audit-logs";
import { PageHeader } from "@/components/shared/molecules/PageHeader";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";

export const AuditLogsPage = () => {
  const { data: logs, isLoading, isError, error, refetch } = useAuditLogs();

  return (
    <Container maxW="6xl" py={{ base: 4, md: 8 }}>
      {/* 1. Standardized Page Header */}
      <PageHeader
        title="System Logs"
        description="Real-time trail of administrative actions and user sessions."
        icon={LuShieldCheck}
        rightElement={
          <AppBadge type="count" value={logs?.length || 0} size="lg" />
        }
      />

      {/* 2. Centralized State Management */}
      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!logs || logs.length === 0}
        emptyMessage="No audit records"
        emptyDescription="The system hasn't recorded any administrative actions yet."
        onRetry={refetch}
      >
        {/* 3. Unified Content Panel */}
        <AppPanel p={0} overflow="hidden">
          <Table.Root size="md" variant="line" stickyHeader>
            <Table.Header bg="bg.muted">
              <Table.Row>
                <Table.ColumnHeader whiteSpace="nowrap">Time</Table.ColumnHeader>
                <Table.ColumnHeader>Operator</Table.ColumnHeader>
                <Table.ColumnHeader>Action</Table.ColumnHeader>
                <Table.ColumnHeader hideBelow="md">Target Entity</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right" hideBelow="sm">
                  Details
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {logs?.map((log) => (
                <Table.Row key={log.id} _hover={{ bg: "bg.subtle" }}>
                  <Table.Cell whiteSpace="nowrap" fontSize="xs">
                    <Text fontWeight="medium">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </Text>
                    <Text color="fg.muted" fontSize="10px">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <Text fontWeight="bold" fontSize="sm" truncate maxW="120px">
                      {log.username}
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    {/* Using our smart atom for consistent action labeling */}
                    <AppBadge type="action" value={log.action} variant="solid" />
                  </Table.Cell>

                  <Table.Cell hideBelow="md" fontFamily="mono" fontSize="xs" color="fg.muted">
                    {log.targetId ? `${log.targetId.split("-")[0]}...` : "—"}
                  </Table.Cell>

                  <Table.Cell textAlign="right" hideBelow="sm">
                    <AppBadge type="count" value="RAW" variant="outline" size="xs" />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </AppPanel>
      </DataStateWrapper>
    </Container>
  );
};

export default AuditLogsPage;