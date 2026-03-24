/**
 * @module LayoutPage
 * The root shell component of the application.
 * It defines the global visual structure, including the persistent Navbar 
 * and the dynamic content area managed by React Router.
 */

"use client";

import { Box, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/NavBar";

/**
 * Main Layout wrapper.
 * Uses a flexbox-based VStack to ensure the main content area expands 
 * to fill at least the full viewport height.
 */
export const LayoutPage = () => {
  return (
    <VStack 
      align="stretch" 
      gap="0" 
      minH="100vh" 
      bg="bg.canvas" 
    >
      {/* Global Navigation: 
        Sticky behavior is handled internally within the Navbar component.
      */}
      <Navbar />

      {/* Main Content Area:
        'flex="1"' ensures this Box grows to push any future footer 
        to the bottom of the viewport.
      */}
      <Box 
        as="main"
        w="full"
        flex="1"
        display="flex"
        flexDirection="column"
      >
        {/* React Router Outlet:
          This is where nested route components (HomePage, AddEmployeePage, etc.) 
          will be injected based on the current URL.
        */}
        <Outlet />
      </Box>

      {/* Placeholder for future Global Footer component */}
    </VStack>
  );
};

export default LayoutPage;