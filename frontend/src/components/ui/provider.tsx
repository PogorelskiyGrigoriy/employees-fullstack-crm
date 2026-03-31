/**
 * @module UIProvider
 * Optimized Chakra 3 provider with fixed "Midnight" dark theme.
 */
"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { system } from "@/theme/index"

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      {children}
    </ChakraProvider>
  )
}