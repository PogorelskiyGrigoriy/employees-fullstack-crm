/**
 * @module Navbar
 * Fully declarative version using RBACGuard.
 * Eliminated manual filtering logic for cleaner component state.
 */

import {
  HStack,
  Spacer,
  Box,
  Button,
  Text,
  Separator,
  Stack,
  Container,
  Icon,
} from "@chakra-ui/react";
import { LuLogOut, LuUser } from "react-icons/lu";

import { AppNavLink } from "@/components/shared/atoms/AppNavLink";
import { StatisticsSelector } from "./StatisticsSelector";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { RBACGuard } from "@/components/shared/organisms/RBACGuard";

import { useAuthStore, useIsAuthenticated, useUserRole } from "@/store/auth-store";
import { useLogout } from "@/services/hooks/auth-hooks/use-logout";
import { MAIN_NAV_LINKS, ROUTES } from "@/config/navigation";

export const Navbar = () => {
  const role = useUserRole();
  const isAuthenticated = useIsAuthenticated();
  const username = useAuthStore((state) => state.user?.username);
  const { mutate: logout, isPending } = useLogout();

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
      backdropFilter="blur(10px)"
    >
      <Container maxW="6xl" px={{ base: "4", md: "8" }}> 
        <HStack justify="space-between" py="3">
          
          {/* 1. Brand & Navigation Links */}
          <HStack gap={{ base: "4", md: "8" }}>
            {!isAuthenticated ? (
              <AppNavLink to={ROUTES.LOGIN}>Sign In</AppNavLink>
            ) : (
              MAIN_NAV_LINKS.map((link) => (
                <RBACGuard key={link.to} roles={link.roles}>
                  <AppNavLink to={link.to}>
                    {link.label}
                  </AppNavLink>
                </RBACGuard>
              ))
            )}
          </HStack>

          <Spacer />

          {/* 2. Global Actions & Profile Context */}
          {isAuthenticated && (
            <HStack gap={{ base: "3", md: "5" }}>
              <Box maxW={{ base: "120px", md: "200px" }}>
                <StatisticsSelector />
              </Box>

              <Separator orientation="vertical" height="24px" borderColor="border.subtle" />

              <HStack gap="3" hideBelow="sm">
                <Stack gap="0" align="flex-end">
                  <Text fontSize="sm" fontWeight="bold" color="fg.emphasized">
                    {username}
                  </Text>
                  <AppBadge type="role" value={role ?? "USER"} size="xs" variant="subtle" />
                </Stack>
                <Icon as={LuUser} color="brand.500" boxSize="5" opacity={0.8} />
              </HStack>

              <Button 
                size="xs" 
                variant="ghost" 
                colorPalette="red" 
                onClick={() => logout()}
                loading={isPending}
                px="3"
              >
                <LuLogOut />
                <Text hideBelow="md">Logout</Text>
              </Button>
            </HStack>
          )}
        </HStack>
      </Container>
    </Box>
  );
};