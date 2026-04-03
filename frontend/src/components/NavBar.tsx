/**
 * @module Navbar
 * Fully Unified Control Center with DRY refactoring.
 * Imports shared interaction atoms (AppNavLink, NavTrigger) for a clean,
 * modular architecture.
 */

import {
  HStack,
  Spacer,
  Box,
  Button,
  Text,
  Separator,
  Container,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { LuUser, LuShieldCheck } from "react-icons/lu";

import { AppNavLink, NavTrigger } from "@/components/shared/atoms/AppNavLink";
import { StatisticsSelector } from "./StatisticsSelector";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { RBACGuard } from "@/components/shared/organisms/RBACGuard";
import { AppDrawerRoot, AppDrawerContent } from "@/components/shared/atoms/AppDrawer";

import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from "@/components/ui/menu";
import { 
  DrawerTrigger, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerBody 
} from "@/components/ui/drawer";

import { useAuthStore, useIsAuthenticated, useUserRole } from "@/store/auth-store";
import { useLogout } from "@/services/hooks/auth-hooks/use-logout";
import { MAIN_NAV_LINKS, ADMIN_NAV_LINKS, ROUTES } from "@/config/navigation";

export const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();
  const username = useAuthStore((state) => state.user?.username);
  const role = useUserRole();
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
        <HStack justify="space-between" py="2">
          
          {/* 1. SECTION: HOME (Using the unified AppNavLink atom) */}
          <HStack gap="1">
            {MAIN_NAV_LINKS.map((link) => (
              <AppNavLink key={link.to} to={link.to}>
                <HStack gap="2">
                  <Icon as={link.icon} color="brand.500" boxSize="4" />
                  <Text letterSpacing="tight" hideBelow="md">{link.label}</Text>
                </HStack>
              </AppNavLink>
            ))}
          </HStack>

          <Spacer />

          {/* 2. SECTION: AUTHENTICATED TOOLS */}
          {isAuthenticated ? (
            <HStack gap="2">
              <StatisticsSelector />

              <Separator orientation="vertical" height="20px" opacity={0.3} hideBelow="sm" />

              <RBACGuard roles={["ADMIN"]}>
                <AdminCenterDrawer />
              </RBACGuard>

              <UserSessionMenu 
                username={username ?? "User"} 
                role={role ?? "USER"} 
                onLogout={() => logout()}
                isLoading={isPending}
              />
            </HStack>
          ) : (
            <AppNavLink to={ROUTES.LOGIN}>
               <HStack gap="2">
                  <Icon as={LuUser} color="brand.500" boxSize="4" />
                  <Text letterSpacing="tight">Sign In</Text>
               </HStack>
            </AppNavLink>
          )}
        </HStack>
      </Container>
    </Box>
  );
};

/* --- Sub-component: Admin Center Drawer --- */

const AdminCenterDrawer = () => (
  <AppDrawerRoot size="sm">
    <DrawerTrigger asChild>
      {/* Use shared NavTrigger for consistent ghost-button styling */}
      <NavTrigger icon={LuShieldCheck} label="Admin" hideLabelBelow="lg" />
    </DrawerTrigger>
    
    <AppDrawerContent>
      <DrawerHeader borderBottomWidth="1px" borderColor="border.subtle" py="5">
        <DrawerTitle fontWeight="black" color="brand.500">ADMIN CENTER</DrawerTitle>
      </DrawerHeader>
      
      <DrawerBody py="6">
        <VStack align="stretch" gap="3">
          {ADMIN_NAV_LINKS.map((link) => (
            <Box key={link.to} width="full">
              <AppNavLink to={link.to}>
                <Button variant="subtle" width="full" justifyContent="flex-start" size="lg" gap="4">
                  <Icon as={link.icon} color="brand.500" />
                  {link.label}
                </Button>
              </AppNavLink>
            </Box>
          ))}
        </VStack>
      </DrawerBody>
    </AppDrawerContent>
  </AppDrawerRoot>
);

/* --- Sub-component: User Session Menu --- */

const UserSessionMenu = ({ username, role, onLogout, isLoading }: any) => (
  <MenuRoot>
    <MenuTrigger asChild>
      {/* Use shared NavTrigger with Chevron for dropdowns */}
      <NavTrigger 
        icon={LuUser} 
        label={username} 
        showChevron 
        hideLabelBelow="sm" 
      />
    </MenuTrigger>
    
    <MenuContent bg="bg.panel" borderColor="border.subtle" shadow="2xl">
      <Box px="4" py="3">
        <HStack justify="space-between" gap="4">
          <Text fontWeight="bold" fontSize="sm">{username}</Text>
          <AppBadge type="role" value={role} size="xs" />
        </HStack>
      </Box>
      
      <Separator />
      
      <MenuItem 
        value="logout" 
        color="red.400" 
        onClick={onLogout} 
        disabled={isLoading} 
        cursor="pointer" 
        _hover={{ bg: "red.500/10" }}
      >
        Logout
      </MenuItem>
    </MenuContent>
  </MenuRoot>
);