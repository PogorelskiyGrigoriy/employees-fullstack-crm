/**
 * @module AppNavLink
 * Standardized navigation link for Midnight Slate UI.
 * Encapsulates active state logic and indicator styling.
 */

import { Link as ChakraLink } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  children: React.ReactNode;
}

export const AppNavLink = ({ to, children }: Props) => {
  return (
    <ChakraLink 
      asChild 
      variant="plain"
      fontSize="sm"
      fontWeight="semibold"
      color="fg.muted"
      _hover={{ color: "brand.500" }}
      transition="all 0.2s"
      css={{
        "&.active": {
          color: "brand.500",
          fontWeight: "bold",
          position: "relative",
          _after: {
            content: '""',
            position: "absolute",
            bottom: "-18px",
            left: 0,
            width: "100%",
            height: "2px",
            bg: "brand.500",
            borderRadius: "full",
            boxShadow: "0 -2px 10px var(--colors-brand-500)",
          }
        }
      }}
    >
      <NavLink to={to}>{children}</NavLink>
    </ChakraLink>
  );
};