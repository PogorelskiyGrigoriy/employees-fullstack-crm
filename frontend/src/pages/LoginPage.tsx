import { Container, Center } from "@chakra-ui/react";
import { LoginForm } from "@/components/LoginForm";

export const LoginPage = () => (
  <Center minH="100vh" bg="bg.canvas">
    <Container maxW="md">
      <LoginForm />
    </Container>
  </Center>
);