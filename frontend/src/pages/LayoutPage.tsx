/**
 * @module LayoutPage
 * The root shell component of the application.
 * Defines the global visual structure and the "Midnight" backdrop.
 */
"use client";

import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/NavBar";

export const LayoutPage = () => {
  return (
    <Flex 
      direction="column"
      minH="100vh" 
      bg="bg.canvas" 
      color="fg.default"
      transition="background-color 0.3s ease"
    >
      {/* Global Navigation: 
        Stays fixed at the top via sticky inside Navbar. 
      */}
      <Navbar />

      {/* Main Content Area:
        Using 'as="main"' for SEO/Accessibility.
        We ensure it fills the space and provides a clean slot for pages.
      */}
      <Box 
        as="main"
        w="full"
        flex="1"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Outlet />
      </Box>

      {/* Footer placeholder: 
        If we add a footer later, it will naturally sit at the bottom 
        due to flex="1" on the main Box. 
      */}
    </Flex>
  );
};

export default LayoutPage;