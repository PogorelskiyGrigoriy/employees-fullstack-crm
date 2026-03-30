/**
 * @module Navbar
 * Refactored for AAA: High-precision role-based navigation.
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
import { useAuthStore, useIsAuthenticated, useUserRole } from "@/store/auth-store";
import { useLogout } from "@/services/hooks/auth-hooks/use-logout";
import { MAIN_NAV_LINKS, ROUTES } from "@/config/navigation";

export const Navbar = () => {
  const role = useUserRole();
  const isAuthenticated = useIsAuthenticated();
  const username = useAuthStore((state) => state.user?.username);
  
  const { mutate: logout, isPending } = useLogout();

  /**
   * RBAC Logic: Filtering links based on strict UserRole comparison.
   */
  const visibleLinks = useMemo(() => {
    if (!isAuthenticated || !role) return [];
    return MAIN_NAV_LINKS.filter((link) => link.roles.includes(role));
  }, [isAuthenticated, role]);

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
          {isAuthenticated && (
            <HStack gap={{ base: "3", md: "5" }}>
              <Box maxW={{ base: "100px", md: "200px" }}>
                <StatisticsSelector />
              </Box>

              <Separator orientation="vertical" height="20px" />

              <Stack gap="0" align="flex-end" hideBelow="sm">
                <Text fontSize="xs" fontWeight="bold" lineHeight="tight">
                  {username}
                </Text>
                <Text fontSize="10px" color="fg.muted" textTransform="uppercase" letterSpacing="wider">
                  {role}
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