/**
 * @module HomePage
 */

"use client";

import { useState, useMemo } from "react";
import {
  Box, Heading, Text, VStack, Container, HStack, Button, Separator,
} from "@chakra-ui/react";
import { LuFilter } from "react-icons/lu";

import {
  DialogBody, DialogCloseTrigger, DialogContent, DialogHeader,
  DialogRoot, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

import { Employees } from "@/components/Employees";
import { Filters } from "@/components/Filters";
import { ActiveFilters } from "@/components/ActiveFilters";
import { useEmployees } from "@/services/hooks/useEmployees";
import { useFilters } from "@/store/filters-store";
import { employeeFilterSchema } from "@crm/shared/schemas/employee.schema.js";

export const HomePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { filteredCount } = useEmployees();
  
  const { filters } = useFilters();
  const isFiltered = useMemo(() => {
    const defaults = employeeFilterSchema.parse({});
    return JSON.stringify(filters) !== JSON.stringify(defaults);
  }, [filters]);

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }} px={{ base: "4", md: "8" }}>
      <VStack align="stretch" gap="8">
        
        <HStack justify="space-between" align="flex-end" wrap="wrap" gap="4">
          <VStack align="flex-start" gap="1">
            <Heading size={{ base: "2xl", md: "4xl" }} letterSpacing="tight">
              Team Directory
            </Heading>
            <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} maxW="2xl">
              Manage and overview organization members across all departments.
            </Text>
          </VStack>

          <DialogRoot
            open={isDialogOpen}
            onOpenChange={(e) => setIsDialogOpen(e.open)}
            size="sm"
            placement="center"
          >
            <DialogTrigger asChild>
              <Button
                variant={isFiltered ? "solid" : "outline"}
                colorPalette={isFiltered ? "blue" : "gray"}
                size="md"
                rounded="full"
                px="6"
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
              <DialogHeader><DialogTitle fontSize="xl">Filter Directory</DialogTitle></DialogHeader>
              <DialogBody pb="6">
                <Filters onClose={() => setIsDialogOpen(false)} />
              </DialogBody>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        </HStack>

        <Separator borderColor="border.subtle" />

        <VStack align="stretch" gap="4">
          <ActiveFilters />
          
          <Box 
            bg="bg.panel" 
            borderRadius="xl" 
            borderWidth={isFiltered ? "1px" : "0px"} 
            borderColor="blue.100"
            transition="all 0.3s ease"
          >
            <Employees />
          </Box>
        </VStack>

        <VStack gap="1" mt="4">
          <Separator mb="4" width="40px" />
          <Text 
            fontSize="2xs" 
            color="fg.subtle" 
            textAlign="center" 
            textTransform="uppercase" 
            letterSpacing="widest"
          >
            Live Sync: Express Engine Port 3000
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
};