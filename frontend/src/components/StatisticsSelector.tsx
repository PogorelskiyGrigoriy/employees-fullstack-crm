/**
 * @module StatisticsSelector
 * Role-based analytics switcher.
 * Refactored for Midnight Slate aesthetics and standardized design tokens.
 */

"use client";

import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon, Text, HStack, Box } from "@chakra-ui/react";
import { LuChevronDown, LuChartColumn } from "react-icons/lu";

import { 
  MenuContent, 
  MenuItem, 
  MenuRoot, 
  MenuTrigger 
} from "@/components/ui/menu"; 

import { STATS_NAV_LINKS } from "@/config/navigation";
import { useIsAuthenticated, useUserRole } from "@/store/auth-store";
import type { UserRole } from "@crm/shared/schemas/auth.schema.js";

export const StatisticsSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole() as UserRole | null;

  /**
   * Filter stats based on role to decide if we should render the component.
   */
  const allowedStats = useMemo(() => {
    if (!isAuthenticated || !userRole) return [];
    return STATS_NAV_LINKS.filter(link => 
      (link.roles as readonly string[]).includes(userRole)
    );
  }, [isAuthenticated, userRole]);

  const activeStat = useMemo(() => {
    return allowedStats.find(link => link.to === location.pathname);
  }, [allowedStats, location.pathname]);

  if (allowedStats.length === 0) return null;

  return (
    <MenuRoot positioning={{ placement: "bottom-end" }}>
      <MenuTrigger asChild>
        <Button 
          variant="subtle" 
          size="sm"
          bg={activeStat ? "brand.500/10" : "bg.panel"} 
          borderWidth="1px"
          borderColor={activeStat ? "brand.500/40" : "border.subtle"}
          color={activeStat ? "brand.500" : "fg.emphasized"}
          fontWeight={activeStat ? "bold" : "medium"}
          px="4"
          height="36px"
          borderRadius="full"
          _hover={{ 
            bg: "brand.500/20", 
            borderColor: "brand.500",
          }}
          transition="all 0.2s"
        >
          <HStack gap="2">
            <Icon as={LuChartColumn} color={activeStat ? "brand.500" : "fg.muted"} />
            <Text letterSpacing="tight">
              {activeStat ? activeStat.label : "Analytics"} 
            </Text>
            <Icon 
              as={LuChevronDown} 
              transition="transform 0.2s"
              opacity={0.6}
            />
          </HStack>
        </Button>
      </MenuTrigger>
      
      <MenuContent 
        minW="200px" 
        bg="bg.panel" 
        borderRadius="xl" 
        shadow="2xl"
        borderColor="border.subtle"
      >
        {allowedStats.map((item) => {
          const isSelected = item.to === location.pathname;
          
          return (
            <MenuItem 
              key={item.to} 
              value={item.to}
              onClick={() => navigate(item.to)}
              color={isSelected ? "brand.500" : "fg.muted"}
              fontWeight={isSelected ? "black" : "medium"}
              bg={isSelected ? "brand.500/5" : "transparent"}
              _hover={{ bg: "bg.muted", color: "fg.emphasized" }}
              cursor="pointer"
              py="3"
            >
              <HStack justify="space-between" width="full">
                <Text>{item.label}</Text>
                {isSelected && (
                  <Box boxSize="1.5" borderRadius="full" bg="brand.500" />
                )}
              </HStack>
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};