import { HStack, Text, Avatar as ChakraAvatar } from "@chakra-ui/react";

export const EmployeeIdentity = ({ name, avatar }: { name: string, avatar?: string }) => (
  <HStack gap="3">
    <ChakraAvatar.Root size="sm">
      <ChakraAvatar.Fallback name={name} />
      <ChakraAvatar.Image src={avatar} alt={name} />
    </ChakraAvatar.Root>
    <Text fontWeight="medium" fontSize={{ base: "xs", md: "sm" }} color="fg.emphasized">
      {name}
    </Text>
  </HStack>
);