/**
 * @module HomePage
 * The primary dashboard for the Team Directory.
 * Refactored to utilize the PageHeader molecule and AppPanel atom.
 */

"use client";

import { useState, useMemo } from "react";
import { Container, VStack, Text, Button, Separator } from "@chakra-ui/react";
import { LuFilter, LuActivity } from "react-icons/lu";

import {
  DialogBody, DialogCloseTrigger, DialogContent, DialogHeader,
  DialogRoot, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

import { Employees } from "@/components/Employees";
import { Filters } from "@/components/Filters";
import { ActiveFilters } from "@/components/ActiveFilters";
import { PageHeader } from "@/components/shared/molecules/PageHeader";
import { AppPanel } from "@/components/shared/atoms/AppPanel";

import { useEmployees } from "@/services/hooks/use-employees";
import { useFilters } from "@/store/filters-store";
import { employeeFilterSchema } from "@crm/shared/schemas/employee.schema.js";

export const HomePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { filteredCount } = useEmployees();
  
  const { filters } = useFilters();

  /**
   * Domain Logic: Check if current filters differ from schema defaults
   */
  const isFiltered = useMemo(() => {
    const defaults = employeeFilterSchema.parse({});
    return JSON.stringify(filters) !== JSON.stringify(defaults);
  }, [filters]);

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }} px={{ base: "4", md: "8" }}>
      <VStack align="stretch" gap="8">
        
        {/* 1. Integrated Page Header */}
        <PageHeader
          title="Team Directory"
          description="Manage and overview organization members across all departments."
          icon={LuActivity} // Added an icon for visual flair
          rightElement={
            <DialogRoot
              open={isDialogOpen}
              onOpenChange={(e) => setIsDialogOpen(e.open)}
              size="sm"
              placement="center"
            >
              <DialogTrigger asChild>
                <Button
                  variant={isFiltered ? "solid" : "outline"}
                  colorPalette={isFiltered ? "brand" : "gray"}
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
              
              <DialogContent borderRadius="2xl" bg="bg.panel">
                <DialogHeader borderBottomWidth="1px" borderColor="border.subtle">
                  <DialogTitle fontSize="xl">Filter Directory</DialogTitle>
                </DialogHeader>
                <DialogBody pb="6">
                  <Filters onClose={() => setIsDialogOpen(false)} />
                </DialogBody>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          }
        />

        <Separator borderColor="border.subtle" />

        {/* 2. Content Section */}
        <VStack align="stretch" gap="4">
          <ActiveFilters />
          
          {/* Main List wrapped in AppPanel */}
          <AppPanel 
            p={0} 
            overflow="hidden"
            borderColor={isFiltered ? "brand.500/40" : "border.subtle"}
            transition="border-color 0.3s ease"
          >
            <Employees />
          </AppPanel>
        </VStack>

        {/* 3. System Status Footer */}
        <VStack gap="2" mt="8" opacity={0.5}>
          <Separator width="40px" />
          <Text 
            fontSize="2xs" 
            color="fg.subtle" 
            textAlign="center" 
            textTransform="uppercase" 
            letterSpacing="widest"
            fontWeight="bold"
          >
            Live Sync: Express Engine Port 3000
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
};

export default HomePage;