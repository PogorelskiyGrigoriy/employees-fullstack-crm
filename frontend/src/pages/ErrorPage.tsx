/**
 * @module ErrorPage
 * The global error boundary and route fallback.
 * Catches and categorizes different failure modes:
 * 1. Router 404s/Redirect failures.
 * 2. Axios/API network errors.
 * 3. General runtime exceptions & Zod schema mismatches.
 */

"use client";

import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import {
  Center, VStack, Heading, Text, Button,
  Code, Box, IconButton, useClipboard, HStack
} from "@chakra-ui/react";
import { LuHouse, LuRefreshCw, LuCopy, LuCheck, LuCircleAlert } from "react-icons/lu";
import axios from "axios";

/**
 * Renders a full-screen error view with recovery actions.
 */
const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Baseline error context
  let statusCode = "Error";
  let title = "Oops! Something went wrong";
  let description = "An unexpected error has occurred in the application.";
  let debugMessage = "";

  /**
   * Error Parsing Strategy:
   * We differentiate between routing, network, and code errors to provide
   * meaningful guidance to the user.
   */
  if (isRouteErrorResponse(error)) {
    // 1. Router Errors (e.g., trying to access /unknown-page)
    statusCode = error.status.toString();
    if (error.status === 404) {
      title = "Page Not Found";
      description = "Sorry, we couldn't find the page you are looking for.";
    }
    debugMessage = error.statusText || JSON.stringify(error.data);
  } else if (axios.isAxiosError(error)) {
    // 2. API Failures (handled by Axios interceptors and passed here)
    statusCode = error.response?.status?.toString() || "API";
    title = "Server Error";
    description = "Our servers are having a moment. Please try again later.";
    debugMessage = error.message;
  } else if (error instanceof Error) {
    // 3. Runtime Exceptions (Zod validation, Logic errors, etc.)
    title = "Application Error";
    description = "An internal error occurred while processing data.";
    debugMessage = error.stack || error.message;
  }

  // Hook for copying logs - useful for bug reporting
  const clipboard = useClipboard({ value: debugMessage || statusCode });

  return (
    <Center h="100vh" p="6" bg="bg.canvas">
      <VStack gap="8" maxW="lg" textAlign="center">
        
        {/* Visual Cue: Critical Alert Icon */}
        <Box color="red.500">
          <LuCircleAlert size="64" />
        </Box>

        {/* Messaging Section */}
        <VStack gap="2">
          <Heading size="3xl" letterSpacing="tight">
            {statusCode !== "Error" && `${statusCode}: `}{title}
          </Heading>
          <Text fontSize="lg" color="fg.muted">
            {description}
          </Text>
        </VStack>

        {/* Recovery Actions: Home or Hard Refresh */}
        <HStack gap="4">
          <Button
            variant="solid"
            onClick={() => navigate("/")}
          >
            <LuHouse /> Back to Home
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <LuRefreshCw /> Refresh Page
          </Button>
        </HStack>

        {/* Technical Details: Collapsible/Scrollable logs for support */}
        <Box w="full" mt="4">
          <HStack justify="center" mb="2">
            <Text fontSize="xs" color="fg.subtle" fontWeight="bold">
              DETAILS FOR SUPPORT
            </Text>
            <IconButton
              aria-label="Copy error"
              size="xs"
              variant="ghost"
              onClick={clipboard.copy}
            >
              {clipboard.copied ? <LuCheck /> : <LuCopy />}
            </IconButton>
          </HStack>
          <Code
            display="block"
            p="4"
            borderRadius="md"
            fontSize="xs"
            textAlign="left"
            whiteSpace="pre-wrap"
            maxH="200px"
            overflowY="auto"
            w="full"
          >
            {debugMessage || "No additional logs available"}
          </Code>
        </Box>
      </VStack>
    </Center>
  );
};

export default ErrorPage;