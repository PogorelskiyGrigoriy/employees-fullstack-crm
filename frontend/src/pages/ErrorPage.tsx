/**
 * @module ErrorPage
 * Refactored to align with the "Midnight Slate" design system.
 * Replaced hardcoded orange/red alerts with subtle semantic panels.
 */
"use client";

import { useRouteError, useNavigate } from "react-router-dom";
import { 
  Center, VStack, Heading, Text, Button, Code, 
  Box, IconButton, HStack, List 
} from "@chakra-ui/react";
import { useClipboard } from "@chakra-ui/react";
import { 
  LuHouse, LuRefreshCw, LuCopy, LuCheck, 
  LuCircleAlert, LuTriangleAlert 
} from "react-icons/lu";

import { getErrorData, formatValidationErrors } from "@/utils/error-helpers";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { AppBadge } from "@/components/shared/atoms/AppBadge";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();
  const { status, title, desc, debug, validation } = getErrorData(error);
  
  const { copied, copy } = useClipboard({ value: debug || String(status) });
  const validationMessages = validation ? formatValidationErrors(validation) : [];

  return (
    <Center h="100vh" p="6" bg="bg.canvas" color="fg.default">
      <VStack gap="8" maxW="xl" w="full">
        {/* Error Icon with Brand/Red Accent */}
        <Box color="red.500" filter="drop-shadow(0 0 10px rgba(239, 68, 68, 0.2))">
          <LuCircleAlert size="64" />
        </Box>

        {/* Title & Status */}
        <VStack gap="2" textAlign="center">
          <HStack gap="3" justify="center">
             <AppBadge type="count" value={status} colorPalette="red" size="lg" />
             <Heading size="3xl" letterSpacing="tight" color="fg.emphasized">
               {title}
             </Heading>
          </HStack>
          <Text color="fg.muted" fontSize="lg">
            {desc}
          </Text>
        </VStack>

        {/* Validation Issues Block (Cleaned up) */}
        {validationMessages.length > 0 && (
          <AppPanel 
            w="full" 
            borderColor="orange.500/30" 
            bg="orange.500/5" 
            p="4"
          >
            <HStack color="orange.500" mb="3">
              <LuTriangleAlert />
              <Text fontWeight="bold" fontSize="sm">Validation Issues:</Text>
            </HStack>
            <List.Root fontSize="sm" color="fg.muted" variant="marker">
              {validationMessages.map((m, i) => (
                <List.Item key={i}>{m}</List.Item>
              ))}
            </List.Root>
          </AppPanel>
        )}

        {/* Main Actions */}
        <HStack gap="4">
          <Button 
            onClick={() => navigate("/")} 
            colorPalette="brand" 
            size="lg"
            px="8"
          >
            <LuHouse /> Return Home
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="lg"
          >
            <LuRefreshCw /> Try Again
          </Button>
        </HStack>

        {/* Technical Details (Support Info) */}
        <Box w="full" mt="4">
          <HStack justify="center" mb="3">
            <Text fontSize="2xs" fontWeight="black" color="fg.muted" letterSpacing="widest">
              SUPPORT DETAILS
            </Text>
            <IconButton 
              size="xs" 
              variant="ghost" 
              onClick={copy} 
              aria-label="copy technical details"
            >
              {copied ? <LuCheck color="green" /> : <LuCopy />}
            </IconButton>
          </HStack>
          
          <AppPanel p="3" bg="bg.muted" borderWidth="1px">
            <Code 
              display="block" 
              bg="transparent" 
              color="fg.muted" 
              fontSize="xs" 
              textAlign="left" 
              maxH="150px" 
              overflowY="auto"
              whiteSpace="pre-wrap"
            >
              {debug}
            </Code>
          </AppPanel>
        </Box>
      </VStack>
    </Center>
  );
};

export default ErrorPage;