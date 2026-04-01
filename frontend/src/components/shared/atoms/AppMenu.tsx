/**
 * @module AppMenu
 * Standardized dropdown components for the Midnight Slate system.
 * Final Fix: Added MenuPositioner to sync coordinates within the Portal.
 */

import { 
  MenuContent as ChakraMenuContent,
  MenuItem as ChakraMenuItem,
  MenuPositioner,
  Portal, 
  type MenuContentProps, 
  type MenuItemProps 
} from "@chakra-ui/react";

/**
 * Enhanced MenuContent.
 * Portal + MenuPositioner ensures the menu "floats" above the UI
 * without shifting the layout and stays perfectly anchored to the button.
 */
export const AppMenuContent = (props: MenuContentProps) => (
  <Portal> 
    <MenuPositioner> 
      <ChakraMenuContent
        {...props}
        bg="bg.panel"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="border.emphasized"
        shadow="dark-lg"
        zIndex="popover"
        p="1"
        outline="none"
      />
    </MenuPositioner>
  </Portal>
);

/**
 * Styled MenuItem
 */
export const AppMenuItem = (props: MenuItemProps) => (
  <ChakraMenuItem
    {...props}
    borderRadius="lg"
    cursor="pointer"
    py="3"
    px="4"
    fontSize="sm"
    fontWeight="medium"
    _hover={{ 
      bg: "brand.500/10", 
      color: "brand.500",
      ...props._hover 
    }}
    _active={{ bg: "brand.500/20" }}
    transition="all 0.2s"
  />
);