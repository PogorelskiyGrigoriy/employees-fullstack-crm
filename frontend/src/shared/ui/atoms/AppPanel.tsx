/**
 * @module AppPanel
 * The fundamental structural unit for Chakra UI 3.x.
 * Standardizes backgrounds, borders, and rounding across the CRM.
 */
import { Box, type BoxProps } from "@chakra-ui/react";

interface AppPanelProps extends BoxProps {
  /** Enables hover/active visual feedback for clickable cards */
  isInteractive?: boolean;
}

export const AppPanel = ({ isInteractive, ...props }: AppPanelProps) => {
  const interactiveStyles = isInteractive
    ? {
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        _hover: { 
          bg: "bg.subtle",
          borderColor: "border.emphasized",
          transform: "translateY(-2px)"
        },
        _active: { transform: "scale(0.98)" },
      }
    : {};

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="xl"
      shadow="sm"
      p={6}
      {...interactiveStyles}
      {...props}
    />
  );
};