/**
 * @module HomePage
 * The primary dashboard of the application.
 * Manages the layout for employee exploration, integrating the filtering dialog, 
 * active filter indicators, and the main data grid/list.
 */

"use client";

import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  HStack,
  Button,
  Separator,
} from "@chakra-ui/react";
import { LuFilter } from "react-icons/lu";

import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Employees } from "@/components/Employees";
import { Filters } from "@/components/Filters";
import { ActiveFilters } from "@/components/ActiveFilters";
import { useEmployees } from "@/services/hooks/useEmployees";

/**
 * Main landing page component.
 * Features a responsive header and a modal-based filtering system to maximize screen real estate.
 */
export const HomePage = () => {
  // Local state to control the visibility of the advanced filters modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Access global employee state to track current search results vs total records
  const { filteredCount, totalCount } = useEmployees();

  /**
   * Filter State Logic:
   * If filteredCount differs from totalCount, we consider the view "filtered".
   * This triggers visual highlights on the UI.
   */
  const isFiltered = filteredCount !== totalCount;

  return (
    <Container 
      maxW="6xl"
      py={{ base: "6", md: "10" }}
      px={{ base: "4", md: "8" }}
    >
      <VStack align="stretch" gap="8">
        
        {/* --- Header Section --- */}
        <HStack justify="space-between" align="flex-end" wrap="wrap" gap="4">
          <VStack align="flex-start" gap="1">
            <Heading size={{ base: "2xl", md: "4xl" }} letterSpacing="tight">
              Team Directory
            </Heading>
            <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} maxW="2xl">
              Manage and overview organization members across all departments.
            </Text>
          </VStack>

          {/* Advanced Filters Dialog (Modal) */}
          <DialogRoot
            open={isDialogOpen}
            onOpenChange={(e) => setIsDialogOpen(e.open)}
            size="sm"
            placement="center"
            motionPreset="slide-in-bottom"
          >
            <DialogTrigger asChild>
              <Button
                variant={isFiltered ? "solid" : "outline"}
                colorPalette={isFiltered ? "blue" : "gray"}
                size="md"
                rounded="full"
                px="6"
                // Interactive feedback: button "pops" when filters are active
                shadow={isFiltered ? "md" : "none"}
              >
                <LuFilter />
                Filters
                {isFiltered && (
                  <Text as="span" ms="1" fontWeight="bold">
                    ({filteredCount})
                  </Text>
                )}
              </Button>
            </DialogTrigger>
            
            <DialogContent borderRadius="2xl">
              <DialogHeader>
                <DialogTitle fontSize="xl">Filter Directory</DialogTitle>
              </DialogHeader>
              <DialogBody pb="6">
                {/* Passing close function to the Filters component for better UX */}
                <Filters onClose={() => setIsDialogOpen(false)} />
              </DialogBody>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        </HStack>

        <Separator borderColor="border.subtle" />

        {/* --- Data & Controls Area --- */}
        <VStack align="stretch" gap="4">
          {/* Quick-remove tags for active filters */}
          <ActiveFilters />
          
          <Box 
            bg="bg.panel" 
            borderRadius="xl" 
            // Subtle visual bridge: container gets a border when results are narrowed down
            borderWidth={isFiltered ? "1px" : "0px"} 
            borderColor="blue.100"
            transition="all 0.3s ease"
          >
            <Employees />
          </Box>
        </VStack>

        {/* --- Footer Status Section --- */}
        <VStack gap="1" mt="4">
          <Separator mb="4" width="40px" />
          <Text 
            fontSize="2xs" 
            color="fg.subtle" 
            textAlign="center" 
            textTransform="uppercase" 
            letterSpacing="widest"
          >
            Live Sync: JSON-Server Port 4000
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
};