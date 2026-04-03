/**
 * @module AppDrawer
 * Standardized Sidebar/Drawer component for mobile and tablet interfaces.
 * Provides a slide-out panel for navigation and administrative controls.
 */

import {
  DrawerRoot as ChakraDrawerRoot,
  DrawerBackdrop,
  DrawerContent,
  DrawerPositioner,
  Portal,
  Box,
  type DrawerRootProps,
  type DrawerContentProps,
} from "@chakra-ui/react";
import { DrawerCloseTrigger } from "@/components/ui/drawer";

/**
 * Standardized Drawer Root for Mobile/Tablet.
 * Animation is handled automatically by the system.
 */
export const AppDrawerRoot = (props: DrawerRootProps) => {
  return (
    <ChakraDrawerRoot 
      {...props} 
      size={{ base: "full", sm: "xs" }} 
      placement="start" 
    >
      <DrawerBackdrop bg="blackAlpha.800" backdropFilter="blur(8px)" />
      {props.children}
    </ChakraDrawerRoot>
  );
};

/**
 * Enhanced DrawerContent with Slate aesthetics.
 */
export const AppDrawerContent = (props: DrawerContentProps) => {
  const { children, ...rest } = props;

  return (
    <Portal>
      <DrawerPositioner>
        <DrawerContent
          {...rest}
          bg="bg.panel"
          borderEndWidth="1px"
          borderColor="whiteAlpha.200"
          position="relative"
          outline="none"
          height="100dvh"
          maxH="100dvh"
          overflowY="auto"
          boxShadow="2xl"
        >
          {/* Midnight Slate Signature Accent */}
          <Box 
            position="absolute" 
            insetEnd="0"
            top="0" 
            bottom="0" 
            width="1px" 
            bgGradient="to-b" 
            gradientFrom="transparent" 
            gradientVia="brand.500" 
            gradientTo="transparent" 
            opacity={0.6}
            pointerEvents="none"
          />
          
          {children}
          
          <DrawerCloseTrigger 
            color="fg.muted" 
            _hover={{ color: "brand.500", bg: "brand.500/10" }}
            top="2"
            insetEnd="2"
            p="4" 
          />
        </DrawerContent>
      </DrawerPositioner>
    </Portal>
  );
};