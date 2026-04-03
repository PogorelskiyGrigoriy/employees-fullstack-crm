/**
 * @module UIProvider
 * Optimized Chakra 3 provider with forced Dark Mode.
 */
"use client"

import { ChakraProvider, Theme } from "@chakra-ui/react"
import { system } from "@/shared/config/theme/index"

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <Theme appearance="dark" colorPalette="brand">
        {children}
      </Theme>
    </ChakraProvider>
  )
}