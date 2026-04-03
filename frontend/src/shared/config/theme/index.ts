/**
 * @module ThemeConfig
 * Solid UI Version: Removed all alpha-transparency tokens.
 * Using solid Zinc shades for high-performance, opaque interfaces.
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

    semanticTokens: {
      colors: {
        bg: {
          canvas: { value: "{colors.zinc.950}" }, 
          panel: { value: "#18181b" },   // Сплошной Zinc 900
          muted: { value: "{colors.zinc.800}" }, // Сплошной фон
          subtle: { value: "#27272a" },  // Заменили whiteAlpha.50 на Zinc 800
        },
        fg: {
          default: { value: "#f4f4f5" }, // Заменили whiteAlpha.900 на Zinc 100
          muted: { value: "{colors.zinc.400}" },
          emphasized: { value: "#ffffff" },
          info: { value: "{colors.brand.500}" },
        },
        border: {
          // Заменили прозрачные границы на твердые цвета
          subtle: { value: "#27272a" },     // Твердый Zinc 800
          emphasized: { value: "#3f3f46" }, // Твердый Zinc 700
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);