/**
 * @module AppNavLink
 * Shared atoms for Navbar interactions.
 * Contains NavTrigger (for Buttons/Menus) and AppNavLink (for Routing).
 * Final Visual Fix: All text is white, even when active.
 */

import { 
  Link as ChakraLink, 
  Button, 
  HStack, 
  Icon, 
  Text, 
  type ButtonProps 
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";

/* --- 1. NavTrigger: Remains unchanged --- */

export interface NavTriggerProps extends ButtonProps {
  icon: React.ElementType;
  label?: string;
  hideLabelBelow?: "sm" | "md" | "lg";
  showChevron?: boolean;
}

export const NavTrigger = ({ 
  icon, 
  label, 
  hideLabelBelow, 
  showChevron, 
  children, 
  ...props 
}: NavTriggerProps) => (
  <Button
    variant="ghost"
    size="sm"
    color="white"
    fontWeight="bold"
    px="3"
    _hover={{ bg: "whiteAlpha.100" }}
    {...props}
  >
    <HStack gap="2">
      <Icon as={icon} color="brand.500" boxSize="4" />
      {label && (
        <Text letterSpacing="tight" hideBelow={hideLabelBelow}>
          {label}
        </Text>
      )}
      {children}
      {showChevron && <Icon as={LuChevronDown} opacity={0.5} boxSize="3" />}
    </HStack>
  </Button>
);

/* --- 2. AppNavLink: Final Fix for white text --- */

interface AppNavLinkProps {
  to: string;
  children: React.ReactNode;
}

export const AppNavLink = ({ to, children }: AppNavLinkProps) => {
  return (
    <ChakraLink 
      asChild 
      variant="plain"
      fontSize="sm"
      fontWeight="bold"
      color="white" // Base color: White
      px="3"
      py="2"
      borderRadius="md"
      _hover={{ 
        bg: "whiteAlpha.100", 
        textDecoration: "none",
        opacity: 0.9 
      }}
      transition="all 0.2s"
      display="inline-flex"
      alignItems="center"
      css={{
        "&.active": {
          // FIX: Text stays white even when the route is active
          color: "white", 
          // All other indicators (lines/dots) are removed for total minimalism
        }
      }}
    >
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
};