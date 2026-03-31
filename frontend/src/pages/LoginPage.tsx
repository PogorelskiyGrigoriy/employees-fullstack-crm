/**
 * @module LoginPage
 * The authentication gateway.
 * Provides a centered, distraction-free environment for user entry.
 */
"use client";

import { Container, Center } from "@chakra-ui/react";
import { LoginForm } from "@/components/LoginForm";

export const LoginPage = () => {
  return (
    <Center 
      minH="100vh" 
      bg="bg.canvas" 
      p={4}
      /** * Subtle brand accent: adds a very faint indigo glow in the top-right corner 
       * to match our Midnight brand identity.
       */
      backgroundImage="radial-gradient(circle at top right, rgba(99, 102, 241, 0.03), transparent 40%)"
    >
      <Container maxW="md">
        {/* The LoginForm component internally uses the AppPanel logic 
          (background, border, shadow), keeping the UI consistent.
        */}
        <LoginForm />
      </Container>
    </Center>
  );
};

export default LoginPage;