/**
 * @module StatisticsSelector
 * Role-based analytics switcher.
 * Optimized with AppMenu atoms for consistent high-contrast UI in dark mode.
 */

"use client";

import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon, Text, HStack, Box } from "@chakra-ui/react";
import { LuChevronDown, LuChartColumn } from "react-icons/lu";

import { MenuRoot, MenuTrigger } from "@/components/ui/menu"; 
import { AppMenuContent, AppMenuItem } from "@/components/shared/atoms/AppMenu";

import { STATS_NAV_LINKS } from "@/config/navigation";
import { useIsAuthenticated, useUserRole } from "@/store/auth-store";
import type { UserRole } from "@crm/shared/schemas/auth.schema.js";

export const StatisticsSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole() as UserRole | null;

  /**
   * RBAC Filtering: determines which stats pages the user can access.
   */
  const allowedStats = useMemo(() => {
    if (!isAuthenticated || !userRole) return [];
    return STATS_NAV_LINKS.filter(link => 
      (link.roles as readonly string[]).includes(userRole)
    );
  }, [isAuthenticated, userRole]);

  /**
   * Visual Sync: highlights the selector if the user is currently on a stats page.
   */
  const activeStat = useMemo(() => {
    return allowedStats.find(link => link.to === location.pathname);
  }, [allowedStats, location.pathname]);

  if (allowedStats.length === 0) return null;

  return (
    <MenuRoot positioning={{ placement: "bottom-end", offset: { mainAxis: 8 } }}>
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

      {/* New Atom: Handles borders, shadows, and z-index automatically */}
      <AppMenuContent minW="200px">
        {allowedStats.map((item) => {
          const isSelected = item.to === location.pathname;
          
          return (
            <AppMenuItem 
              key={item.to} 
              value={item.to}
              onClick={() => navigate(item.to)}
              color={isSelected ? "brand.500" : "fg.default"}
              fontWeight={isSelected ? "bold" : "medium"}
            >
              <HStack justify="space-between" width="full">
                <Text fontSize="sm">{item.label}</Text>
                
                {/* Active Indicator: Small glowing dot */}
                {isSelected && (
                  <Box 
                    boxSize="2" 
                    borderRadius="full" 
                    bg="brand.500" 
                    shadow="0 0 8px var(--colors-brand-500)" 
                  />
                )}
              </HStack>
            </AppMenuItem>
          );
        })}
      </AppMenuContent>
    </MenuRoot>
  );
};