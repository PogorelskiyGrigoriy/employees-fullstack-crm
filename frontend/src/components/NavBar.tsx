/**
 * @module Navbar
 * Global navigation header with role-based link filtering.
 * Features sticky positioning, active route indicators, and integrated auth controls.
 */

import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { 
  HStack, 
  Link as ChakraLink, 
  Spacer, 
  Box, 
  Button, 
  Text,
  Separator,
  Stack,
  Container,
} from "@chakra-ui/react";

import { StatisticsSelector } from "./StatisticsSelector";
import { useAuthStore, useIsAuthenticated } from "@/store/useAuthStore";
import { useLogout } from "@/services/hooks/authHooks/useLogout";
import { MAIN_NAV_LINKS, ROUTES } from "@/config/navigation";
import type { UserData } from "@/schemas/auth.schema"; 

/**
 * Main application navigation bar.
 * Responsively handles authenticated/unauthenticated states and role visibility.
 */
export const Navbar = () => {
  const user = useAuthStore((state) => state.user as UserData | null);
  const isAuthenticated = useIsAuthenticated(); 
  
  const { mutate: logout, isPending } = useLogout();

  /**
   * RBAC (Role-Based Access Control) Logic:
   * Filters the navigation links defined in config based on the current user's role.
   */
  const visibleLinks = useMemo(() => {
    if (!isAuthenticated || !user) return [];
    
    return MAIN_NAV_LINKS.filter((link) => 
      (link.roles as string[]).includes(user.role)
    );
  }, [isAuthenticated, user]);

  return (
    <Box 
      as="nav" 
      bg="bg.panel" 
      borderBottomWidth="1px" 
      borderColor="border.subtle"
      position="sticky"
      top="0"
      zIndex="sticky"
      w="full"
    >
      <Container maxW="6xl" px={{ base: "4", md: "8" }}> 
        <HStack justify="space-between" py="3">
          
          {/* Left Side: Navigation Links */}
          <HStack gap={{ base: "4", md: "8" }}>
            {!isAuthenticated ? (
              <ChakraLink asChild variant="plain" fontWeight="bold" color="blue.600">
                <NavLink to={ROUTES.LOGIN}>Sign In</NavLink>
              </ChakraLink>
            ) : (
              visibleLinks.map((link) => (
                <ChakraLink 
                  key={link.to} 
                  asChild 
                  variant="plain"
                  fontSize="sm"
                  fontWeight="medium"
                  // Custom styling for active NavLink using React Router's .active class
                  css={{
                    "&.active": {
                      color: "blue.600",
                      fontWeight: "bold",
                      position: "relative",
                      _after: {
                        content: '""',
                        position: "absolute",
                        bottom: "-14px",
                        left: 0,
                        width: "100%",
                        height: "2px",
                        bg: "blue.600",
                      }
                    }
                  }}
                >
                  <NavLink to={link.to}>{link.label}</NavLink>
                </ChakraLink>
              ))
            )}
          </HStack>

          <Spacer />

          {/* Right Side: Profile & Global Actions */}
          {isAuthenticated && user && (
            <HStack gap={{ base: "3", md: "5" }}>
              {/* Context-aware Statistics Trigger */}
              <Box maxW={{ base: "100px", md: "200px" }}>
                <StatisticsSelector />
              </Box>

              <Separator orientation="vertical" height="20px" />

              {/* User Identity Info (Hidden on very small screens) */}
              <Stack gap="0" align="flex-end" hideBelow="sm">
                <Text fontSize="xs" fontWeight="bold" lineHeight="tight">
                  {user.username}
                </Text>
                <Text fontSize="10px" color="fg.muted" textTransform="uppercase">
                  {user.role}
                </Text>
              </Stack>

              <Button 
                size="xs" 
                variant="subtle" 
                colorPalette="red" 
                onClick={() => logout()}
                loading={isPending}
                px="3"
              >
                Logout
              </Button>
            </HStack>
          )}
        </HStack>
      </Container>
    </Box>
  );
};