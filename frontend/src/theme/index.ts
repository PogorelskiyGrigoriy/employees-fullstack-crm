/**
 * @module ThemeConfig
 * Centralized design system tokens for Chakra UI 3.x.
 * Fixed: Added global CSS to force dark mode for native browser elements.
 */
import { createSystem, defineConfig, defaultConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  globalCss: {
    ":root": {
      colorScheme: "dark !important",
    },
    "select option": {
      backgroundColor: "#18181b !important", 
      color: "#ffffff !important",
    },
  },

  theme: {
    // 1. Base Tokens
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
        xl: { value: "12px" },
        "2xl": { value: "16px" },
      },
    },

    // 2. Semantic Tokens
    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.zinc.950}" }, 
          panel: { value: "{colors.zinc.900}" },
          muted: { value: "{colors.zinc.800}" },
          subtle: { value: "{colors.whiteAlpha.50}" },
        },
        fg: {
          default: { value: "{colors.whiteAlpha.900}" },
          muted: { value: "{colors.zinc.400}" },
          emphasized: { value: "{colors.white}" },
          info: { value: "{colors.brand.500}" },
        },
        border: {
          subtle: { value: "{colors.whiteAlpha.100}" },
          emphasized: { value: "{colors.whiteAlpha.300}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);