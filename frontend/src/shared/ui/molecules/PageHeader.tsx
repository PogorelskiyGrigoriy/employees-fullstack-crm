/**
 * @module PageHeader
 * A reusable page header molecule that standardizes titles, descriptions, and actions.
 * Ensures consistent typography and responsive spacing across all main views.
 */
import { Stack, Heading, Text, HStack, Icon, Box, type StackProps } from "@chakra-ui/react";

interface PageHeaderProps extends StackProps {
  title: string;
  description?: string;
  /** Optional Lucide icon to display above the title */
  icon?: React.ElementType;
  /** Content to display on the right side (e.g., a "Create" button or Stats badge) */
  rightElement?: React.ReactNode;
}

export const PageHeader = ({ 
  title, 
  description, 
  icon, 
  rightElement, 
  ...props 
}: PageHeaderProps) => {
  return (
    <Stack
      direction={{ base: "column", sm: "row" }}
      justify="space-between"
      align={{ base: "flex-start", sm: "flex-end" }}
      gap={4}
      mb={8} // Default margin bottom to separate from content
      {...props}
    >
      <Stack gap={1}>
        {icon && (
          <HStack color="brand.500" gap={2}>
            <Icon as={icon} size="sm" />
            <Text 
              fontSize="xs" 
              fontWeight="bold" 
              textTransform="uppercase" 
              letterSpacing="widest"
            >
              System Section
            </Text>
          </HStack>
        )}
        <Heading 
          size={{ base: "xl", md: "2xl" }} 
          letterSpacing="tight"
          color="fg.emphasized"
        >
          {title}
        </Heading>
        {description && (
          <Text color="fg.muted" fontSize="sm" maxW="2xl">
            {description}
          </Text>
        )}
      </Stack>

      {rightElement && (
        <Box w={{ base: "full", sm: "auto" }}>
          {rightElement}
        </Box>
      )}
    </Stack>
  );
};