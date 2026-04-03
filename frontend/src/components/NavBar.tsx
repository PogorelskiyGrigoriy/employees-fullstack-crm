/**
 * @module Navbar
 * Minimalist "Control Center" implementation.
 * Fixed: Replaced Dialog components with Drawer components to resolve context errors.
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
import { 
  LuLogOut, 
  LuUser, 
  LuShieldCheck, 
  LuChevronDown 
} from "react-icons/lu";

import { AppNavLink } from "@/components/shared/atoms/AppNavLink";
import { StatisticsSelector } from "./StatisticsSelector";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { RBACGuard } from "@/components/shared/organisms/RBACGuard";
import { AppDrawerRoot, AppDrawerContent } from "@/components/shared/atoms/AppDrawer";

/**
 * IMPORT FIX:
 * We now use Drawer components instead of Dialog components for the Admin Drawer.
 */
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@/components/ui/menu";
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
        <HStack justify="space-between" py="2.5">
          
          {/* 1. SECTION: HOME */}
          <HStack gap="4">
            {MAIN_NAV_LINKS.map((link) => (
              <AppNavLink key={link.to} to={link.to}>
                <HStack gap="2">
                  <Icon as={link.icon} />
                  <Text fontWeight="bold" letterSpacing="tight" hideBelow="md">
                    {link.label}
                  </Text>
                </HStack>
              </AppNavLink>
            ))}
          </HStack>

          <Spacer />

          {/* 2. SECTION: AUTHENTICATED ACTIONS */}
          {isAuthenticated ? (
            <HStack gap={{ base: "2", md: "4" }}>
              
              <Box maxW={{ base: "100px", sm: "160px", md: "200px" }}>
                <StatisticsSelector />
              </Box>

              <Separator orientation="vertical" height="20px" opacity={0.5} hideBelow="sm" />

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
            <AppNavLink to={ROUTES.LOGIN}>Sign In</AppNavLink>
          )}
        </HStack>
      </Container>
    </Box>
  );
};

/* --- Sub-component: Admin Center Drawer --- */

const AdminCenterDrawer = () => (
  <AppDrawerRoot size="sm">
    {/* FIX: Use DrawerTrigger instead of DialogTrigger */}
    <DrawerTrigger asChild>
      <Button variant="ghost" size="sm" color="brand.500" gap="2" px={{ base: "2", md: "3" }}>
        <LuShieldCheck size="20" />
        <Text hideBelow="lg">Admin</Text>
      </Button>
    </DrawerTrigger>
    
    <AppDrawerContent>
      {/* FIX: Use DrawerHeader instead of DialogHeader */}
      <DrawerHeader borderBottomWidth="1px" borderColor="border.subtle" py="5">
        <DrawerTitle fontWeight="black" color="brand.500" letterSpacing="widest">
          ADMIN CENTER
        </DrawerTitle>
      </DrawerHeader>
      
      {/* FIX: Use DrawerBody instead of DialogBody */}
      <DrawerBody py="6">
        <VStack align="stretch" gap="3">
          {ADMIN_NAV_LINKS.map((link) => (
            <Box key={link.to} width="full">
              <AppNavLink to={link.to}>
                <Button 
                  variant="subtle" 
                  width="full" 
                  justifyContent="flex-start" 
                  size="lg" 
                  gap="4"
                  _hover={{ bg: "brand.500/10", color: "brand.500" }}
                >
                  <Icon as={link.icon} />
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

/* --- Sub-component: User Session Dropdown --- */

const UserSessionMenu = ({ username, role, onLogout, isLoading }: any) => (
  <MenuRoot>
    <MenuTrigger asChild>
      <Button variant="ghost" size="sm" gap="2" px="2" _hover={{ bg: "whiteAlpha.100" }}>
        <Icon as={LuUser} color="brand.500" boxSize="5" />
        <Text hideBelow="sm" fontWeight="bold" fontSize="sm">{username}</Text>
        <LuChevronDown size="14" opacity={0.5} />
      </Button>
    </MenuTrigger>
    
    <MenuContent bg="bg.panel" borderColor="border.subtle" shadow="2xl">
      <Box px="4" py="3">
        <Text fontSize="2xs" color="fg.muted" textTransform="uppercase" mb="1">
          Current Session
        </Text>
        <HStack justify="space-between">
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
        p="3"
        _hover={{ bg: "red.500/10", color: "red.500" }}
      >
        <LuLogOut /> 
        <Text fontWeight="semibold">Logout</Text>
      </MenuItem>
    </MenuContent>
  </MenuRoot>
);