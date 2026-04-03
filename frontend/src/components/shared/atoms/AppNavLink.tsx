/**
 * @module AppNavLink
 * Shared atoms for Navbar interactions.
 * Contains NavTrigger (for Buttons/Menus) and AppNavLink (for Routing).
 * Both follow the "Ghost Button" pattern: White text, Blue icons, Gray hover.
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

/* --- 1. NavTrigger: Visual base for Menus, Drawers, and static buttons --- */

export interface NavTriggerProps extends ButtonProps {
  icon: React.ElementType;
  label?: string;
  hideLabelBelow?: "sm" | "md" | "lg";
  showChevron?: boolean;
}

/**
 * Standardized Ghost Button for Navbar triggers.
 */
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

/* --- 2. AppNavLink: Link wrapper with identical NavTrigger styling --- */

interface AppNavLinkProps {
  to: string;
  children: React.ReactNode;
}

/**
 * Semantic Link atom styled exactly like NavTrigger.
 * Prevents double-hover issues by applying styles directly to the link.
 */
export const AppNavLink = ({ to, children }: AppNavLinkProps) => {
  return (
    <ChakraLink 
      asChild 
      variant="plain"
      fontSize="sm"
      fontWeight="bold"
      color="white"
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
          position: "relative",
          _after: {
            content: '""',
            position: "absolute",
            bottom: "-10px", 
            left: "15%",
            width: "70%",
            height: "2px",
            bg: "brand.500",
            borderRadius: "full",
            boxShadow: "0 0 10px var(--colors-brand-500)",
          }
        }
      }}
    >
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
};