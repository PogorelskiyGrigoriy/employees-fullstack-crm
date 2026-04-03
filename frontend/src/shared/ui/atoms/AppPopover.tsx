import { PopoverContent, Portal, type PopoverContentProps } from "@chakra-ui/react";

export const AppPopoverContent = (props: PopoverContentProps) => (
  <Portal>
    <PopoverContent
      {...props}
      bg="bg.panel"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border.emphasized"
      shadow="dark-lg"
      p="0"
      outline="none"
    />
  </Portal>
);