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
    <MenuRoot positioning={{ placement: "bottom-end", offset: { mainAxis: 8 } }}>
      <MenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          color="white"
          fontWeight="bold"
          px="3"
          // FIX: Используем сплошной цвет вместо прозрачного
          _hover={{ bg: "bg.subtle" }}
          // FIX: Перекрываем дефолтный белый фон при открытом меню
          _open={{ bg: "bg.subtle" }} 
          _active={{ bg: "bg.subtle" }}
          _focus={{ boxShadow: "none" }}
        >
          <HStack gap="2">
            {/* Иконка подсвечивается синим, если выбрана статистика */}
            <Icon 
              as={LuChartColumn} 
              color="brand.500" 
              boxSize="4" 
            />
            <Text letterSpacing="tight" hideBelow="md">
              {activeStat ? activeStat.label : "Analytics"} 
            </Text>
            <Icon as={LuChevronDown} opacity={0.5} boxSize="3" />
          </HStack>
        </Button>
      </MenuTrigger>

      <AppMenuContent minW="200px">
        {allowedStats.map((item) => {
          const isSelected = item.to === location.pathname;
          
          return (
            <AppMenuItem 
              key={item.to} 
              value={item.to}
              onClick={() => navigate(item.to)}
              color={isSelected ? "brand.500" : "white"}
              fontWeight={isSelected ? "bold" : "medium"}
              _hover={{ bg: "bg.subtle" }}
            >
              <HStack justify="space-between" width="full">
                <Text fontSize="sm">{item.label}</Text>
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