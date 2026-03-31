/**
 * @module ThemeConfig
 * Centralized design system tokens for Chakra UI 3.x.
 * Implements the "Midnight Slate" dark theme.
 */
import { createSystem, defineConfig, defaultBaseConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    // 1. Base Tokens (The Palette)
    tokens: {
      colors: {
        brand: {
          50: { value: "#eef2ff" },
          100: { value: "#e0e7ff" },
          500: { value: "#6366f1" },
          600: { value: "#4f46e5" },
          700: { value: "#4338ca" },
        },
      },
      radii: {
        xl: { value: "12px" },   // Standard for AppPanel
        "2xl": { value: "16px" }, // For large modals
      },
    },

    // 2. Semantic Tokens (Contextual Naming)
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.zinc.950}" }, // Deep background (Body)
          panel: { value: "{colors.zinc.900}" },  // Cards, Tables, Forms
          muted: { value: "{colors.zinc.800}" },  // Secondary blocks (Table headers)
          subtle: { value: "{colors.whiteAlpha.50}" }, // Hover states
        },
        fg: {
          default: { value: "{colors.whiteAlpha.900}" }, // Primary text
          muted: { value: "{colors.zinc.400}" },         // Secondary/De-emphasized text
          emphasized: { value: "{colors.white}" },       // Headers/Titles
          info: { value: "{colors.brand.500}" },         // Accent text
        },
        border: {
          subtle: { value: "{colors.whiteAlpha.100}" },   // Standard panel borders
          emphasized: { value: "{colors.whiteAlpha.300}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultBaseConfig, customConfig);