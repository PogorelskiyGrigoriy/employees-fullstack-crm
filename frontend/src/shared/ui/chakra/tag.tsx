import { Tag as ChakraTag } from "@chakra-ui/react"
import * as React from "react"

export interface TagProps extends ChakraTag.RootProps {
  label?: React.ReactNode
  closable?: boolean
  onClose?: React.MouseEventHandler<HTMLButtonElement>
  startElement?: React.ReactNode
  endElement?: React.ReactNode
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  function Tag(props, ref) {
    const {
      label,
      closable,
      onClose,
      startElement,
      endElement,
      children,
      ...rest
    } = props

    return (
      <ChakraTag.Root ref={ref} {...rest}>
        {startElement && (
          <ChakraTag.StartElement>{startElement}</ChakraTag.StartElement>
        )}
        <ChakraTag.Label>{children ?? label}</ChakraTag.Label>
        {endElement && <ChakraTag.EndElement>{endElement}</ChakraTag.EndElement>}
        {closable && (
          <ChakraTag.EndElement>
            <ChakraTag.CloseTrigger onClick={onClose} />
          </ChakraTag.EndElement>
        )}
      </ChakraTag.Root>
    )
  },
)