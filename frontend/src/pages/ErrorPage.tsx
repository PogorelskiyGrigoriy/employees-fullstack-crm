"use client";
import { useRouteError, useNavigate } from "react-router-dom";
import { Center, VStack, Heading, Text, Button, Code, Box, IconButton, useClipboard, HStack, List, Badge } from "@chakra-ui/react";
import { LuHouse, LuRefreshCw, LuCopy, LuCheck, LuCircleAlert, LuTriangleAlert } from "react-icons/lu";
import { getErrorData, formatValidationErrors } from "@/utils/error-helpers";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { status, title, desc, debug, validation } = getErrorData(useRouteError());
  const { copied, copy } = useClipboard({ value: debug || String(status) });
  const validationMessages = validation ? formatValidationErrors(validation) : [];

  return (
    <Center h="100vh" p="6" bg="bg.canvas">
      <VStack gap="6" maxW="xl" w="full">
        <Box color="red.500"><LuCircleAlert size="48" /></Box>

        <VStack gap="2" textAlign="center">
          <Heading size="2xl">
            <Badge colorScheme="red" verticalAlign="middle" mr="2">{status}</Badge>{title}
          </Heading>
          <Text color="fg.muted">{desc}</Text>
        </VStack>

        {validationMessages.length > 0 && (
          <Box w="full" bg="orange.50" p="4" borderRadius="md" border="1px solid" borderColor="orange.200">
            <HStack color="orange.800" mb="2"><LuTriangleAlert /><Text fontWeight="bold">Validation Issues:</Text></HStack>
            <List.Root fontSize="sm" color="orange.900">{validationMessages.map((m, i) => <List.Item key={i}>{m}</List.Item>)}</List.Root>
          </Box>
        )}

        <HStack gap="4">
          <Button onClick={() => navigate("/")} variant="solid"><LuHouse /> Home</Button>
          <Button onClick={() => window.location.reload()} variant="outline"><LuRefreshCw /> Retry</Button>
        </HStack>

        <Box w="full" mt="4" textAlign="center">
          <HStack justify="center" mb="2">
            <Text fontSize="xs" fontWeight="bold" color="fg.subtle">SUPPORT DETAILS</Text>
            <IconButton size="xs" variant="ghost" onClick={copy} aria-label="copy">{copied ? <LuCheck /> : <LuCopy />}</IconButton>
          </HStack>
          <Code display="block" p="3" fontSize="xs" textAlign="left" maxH="150px" overflowY="auto">{debug}</Code>
        </Box>
      </VStack>
    </Center>
  );
};
export default ErrorPage;