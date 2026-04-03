/**
 * @module NativeSelect
 * Custom wrappers for Chakra UI NativeSelect components.
 * Provides a simplified interface for standard browser select elements.
 */

import { NativeSelect as ChakraNativeSelect } from "@chakra-ui/react"
import * as React from "react"

/**
 * Root container for the native select component.
 * Manages the shared state and styling for the field and indicator.
 */
export const NativeSelectRoot = (props: ChakraNativeSelect.RootProps) => {
  return (
    <ChakraNativeSelect.Root {...props}>
      {props.children}
    </ChakraNativeSelect.Root>
  )
}

/**
 * The actual select field with an integrated visual indicator (arrow).
 * Uses forwardRef to ensure compatibility with form libraries and DOM access.
 */
export const NativeSelectField = React.forwardRef<
  HTMLSelectElement,
  ChakraNativeSelect.FieldProps
>(function NativeSelectField(props, ref) {
  const { children, ...rest } = props
  return (
    <>
      <ChakraNativeSelect.Field ref={ref} {...rest}>
        {children}
      </ChakraNativeSelect.Field>
      <ChakraNativeSelect.Indicator />
    </>
  )
})