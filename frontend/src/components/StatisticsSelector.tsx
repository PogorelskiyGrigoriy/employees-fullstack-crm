/**
 * @module StatisticsSelector
 * Role-based dropdown for switching between different statistics dashboards.
 * Provides visual feedback for the currently active analytics view.
 */

"use client";

import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";

import { 
  MenuContent, 
  MenuItem, 
  MenuRoot, 
  MenuTrigger 
} from "@/components/ui/menu"; 

import { STATS_NAV_LINKS } from "@/config/navigation";
import { useIsAuthenticated, useUserRole } from "@/store/useAuthStore";
import type { UserRole } from "@/schemas/auth.schema";

/**
 * Dropdown selector for statistical views.
 * Automatically filters options based on the user's role and highlights the active route.
 */
export const StatisticsSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole() as UserRole | null;

  /**
   * RBAC filtering for statistics links.
   * Ensures users only see dashboards they are authorized to view.
   */
  const allowedStats = useMemo(() => {
    if (!isAuthenticated || !userRole) return [];
    
    return STATS_NAV_LINKS.filter(link => 
      (link.roles as string[]).includes(userRole)
    );
  }, [isAuthenticated, userRole]);

  /**
   * Active State Tracking:
   * Compares the current URL path with defined statistic routes to determine
   * if the selector should be in its "active" (highlighted) state.
   */
  const activeStat = useMemo(() => {
    return allowedStats.find(link => link.to === location.pathname);
  }, [allowedStats, location.pathname]);

  // If the user has no permissions for any stats, don't render the selector at all.
  if (allowedStats.length === 0) return null;

  return (
    <MenuRoot positioning={{ placement: "bottom-end" }}>
      <MenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          bg="bg.panel" 
          borderColor={activeStat ? "blue.500" : "border.emphasized"}
          color={activeStat ? "blue.600" : "fg.emphasized"}
          fontWeight={activeStat ? "bold" : "medium"}
          px="4"
          height="36px"
          _hover={{ 
            bg: "blue.50", 
            borderColor: "blue.400",
          }}
        >
          {activeStat ? activeStat.label : "Statistics"} 
          <Icon 
            as={LuChevronDown} 
            ms="2" 
            transition="transform 0.2s"
            color={activeStat ? "blue.500" : "fg.muted"} 
            // Simple visual cue: icon color deepens when active
            transform={activeStat ? "rotate(0deg)" : "none"} 
          />
        </Button>
      </MenuTrigger>
      
      <MenuContent minW="180px">
        {allowedStats.map((item) => {
          const isSelected = item.to === location.pathname;
          
          return (
            <MenuItem 
              key={item.to} 
              value={item.to}
              onClick={() => navigate(item.to)}
              color={isSelected ? "blue.600" : "inherit"}
              fontWeight={isSelected ? "bold" : "normal"}
              cursor="pointer"
            >
              {item.label}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};