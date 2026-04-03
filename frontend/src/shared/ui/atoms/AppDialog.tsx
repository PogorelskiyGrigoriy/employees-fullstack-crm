/**
 * @module AppDialog
 * Professional Adaptive Dialog using useBreakpointValue.
 * Guaranteed no-stretch on Desktop and real Fullscreen on Mobile.
 */

import { 
  DialogRoot as ChakraDialogRoot, 
  DialogBackdrop, 
  DialogContent, 
  DialogPositioner, 
  Portal, 
  type DialogContentProps, 
  Box,
  type DialogRootProps,
  useBreakpointValue // Наш спаситель
} from "@chakra-ui/react";
import { DialogCloseTrigger } from "@/shared/ui/chakra/dialog";

export const AppDialogRoot = (props: DialogRootProps) => {
  // Явно вычисляем, мобильное ли устройство (точка md = 768px)
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <ChakraDialogRoot 
      {...props} 
      // Если мобилка - размер full, иначе - то, что передали (или sm)
      size={isMobile ? "full" : (props.size || "sm")}
      placement="center" 
      motionPreset="slide-in-bottom"
    >
      <DialogBackdrop bg="blackAlpha.800" backdropFilter="blur(6px)" />
      {props.children}
    </ChakraDialogRoot>
  );
};

export const AppDialogContent = (props: DialogContentProps) => {
  const { children, ...rest } = props;
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Portal>
      <DialogPositioner 
        padding={isMobile ? "0" : "4"}
        // На мобилках прижимаем к верху, на десктопе - строго по центру
        alignItems={isMobile ? "flex-start" : "center"}
        justifyContent="center"
      >
        <DialogContent
          {...rest}
          bg="bg.panel"
          // Явные стили без адаптивных объектов
          borderRadius={isMobile ? "0" : "2xl"}
          borderWidth={isMobile ? "0" : "1px"}
          borderColor="whiteAlpha.400"
          shadow={isMobile ? "none" : "dark-lg"}
          position="relative"
          outline="none"
          // Магия высоты: либо строго 100%, либо столько, сколько нужно контенту
          height={isMobile ? "100dvh" : "auto"}
          width={isMobile ? "100%" : "auto"}
          maxH={isMobile ? "100dvh" : "calc(100vh - 64px)"}
          overflowY="auto"
        >
          {/* Полоску рисуем только на десктопе */}
          {!isMobile && (
            <Box 
              position="absolute" top="0" left="0" right="0" height="1px" 
              bgGradient="to-r" gradientFrom="transparent" gradientVia="brand.500" gradientTo="transparent" 
              opacity={0.5} pointerEvents="none"
            />
          )}
          
          {children}
          
          <DialogCloseTrigger 
            color="fg.muted" 
            _hover={{ color: "brand.500" }} 
            top={isMobile ? "4" : "2"}
            right={isMobile ? "4" : "2"}
          />
        </DialogContent>
      </DialogPositioner>
    </Portal>
  );
};