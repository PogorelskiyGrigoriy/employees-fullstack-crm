/**
 * @module HomePage
 * Primary dashboard for the Team Directory.
 * Refactored to use AppDialogRoot and AppDialogContent for consistency and cleaner code.
 */

"use client";

import { useState, useMemo } from "react";
import { Container, VStack, Text, Button, Separator } from "@chakra-ui/react";
import { LuFilter, LuActivity } from "react-icons/lu";

import {
  DialogBody, 
  DialogHeader,
  DialogTitle, 
  DialogTrigger,
} from "@/shared/ui/chakra/dialog";

import { Employees } from "@/components/Employees";
import { Filters } from "@/components/Filters";
import { ActiveFilters } from "@/components/ActiveFilters";
import { PageHeader } from "@/shared/ui/molecules/PageHeader";
// Импортируем оба наших атома
import { AppDialogContent, AppDialogRoot } from "@/shared/ui/atoms/AppDialog";
import { AppPanel } from "@/shared/ui/atoms/AppPanel";

import { useEmployees } from "@/services/hooks/use-employees";
import { useFilters } from "@/features/filter-employees/model/filters-store";
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
        
        <PageHeader
          title="Team Directory"
          description="Manage and overview organization members across all departments."
          icon={LuActivity}
          rightElement={
            /* 1. Используем AppDialogRoot: Backdrop уже внутри */
            <AppDialogRoot
              open={isDialogOpen}
              onOpenChange={(e) => setIsDialogOpen(e.open)}
              size="sm"
            >
              <DialogTrigger asChild>
                <Button
                  variant={isFiltered ? "solid" : "outline"}
                  colorPalette={isFiltered ? "brand" : "gray"}
                  size="md"
                  rounded="full"
                  px="6"
                  gap="2"
                >
                  <LuFilter />
                  <Text>Filters</Text>
                  {isFiltered && (
                    <Text as="span" fontWeight="black" fontSize="xs" bg="whiteAlpha.200" px="2" borderRadius="full">
                      {filteredCount}
                    </Text>
                  )}
                </Button>
              </DialogTrigger>
              
              {/* 2. Используем AppDialogContent: Крестик и стили уже внутри */}
              <AppDialogContent>
                <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py="4">
                  <DialogTitle fontSize="lg" fontWeight="black" color="brand.500">
                    FILTER SETTINGS
                  </DialogTitle>
                </DialogHeader>

                <DialogBody pb="2">
                  <Filters onClose={() => setIsDialogOpen(false)} />
                </DialogBody>
              </AppDialogContent>
            </AppDialogRoot>
          }
        />

        <Separator borderColor="border.subtle" opacity={0.5} />

        <VStack align="stretch" gap="4">
          <ActiveFilters />
          <AppPanel 
            p={0} 
            overflow="hidden"
            borderColor={isFiltered ? "brand.500/40" : "border.subtle"}
          >
            <Employees />
          </AppPanel>
        </VStack>

        <VStack gap="2" mt="8" opacity={0.3}>
          <Separator width="40px" />
          <Text fontSize="2xs" fontWeight="bold" letterSpacing="widest">
            Live Sync: Express Engine Port 3000
          </Text>
        </VStack>
      </VStack>
    </Container>
  );
};

export default HomePage;