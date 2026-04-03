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
          variant="ghost" // Меняем на ghost для чистоты
          size="sm"
          color="white"   // Текст всегда белый
          fontWeight="bold"
          px="3"
          _hover={{ bg: "whiteAlpha.100" }}
        >
          <HStack gap="2">
            {/* Иконка ВСЕГДА синяя */}
            <Icon as={LuChartColumn} color="brand.500" boxSize="4" />
            <Text letterSpacing="tight" hideBelow="md">
              {activeStat ? activeStat.label : "Analytics"} 
            </Text>
            <Icon as={LuChevronDown} opacity={0.5} boxSize="3" />
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