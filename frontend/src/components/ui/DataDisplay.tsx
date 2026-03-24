/**
 * @module DataDisplay
 * Atomic UI components for consistent data formatting and presentation across the app.
 */

import { Badge, Text, type BadgeProps, HStack, Avatar as ChakraAvatar } from "@chakra-ui/react";
import { formatDateDisplay } from "@/utils/dateUtils";

/**
 * BADGE: Standardized display for counts and numeric quantities.
 */
export const CountBadge = ({ value, ...props }: { value: number } & BadgeProps) => (
  <Badge variant="subtle" colorPalette="blue" px="2" borderRadius="md" {...props}>
    {value}
  </Badge>
);

/**
 * TEXT: Consistent age presentation.
 */
export const AgeText = ({ value }: { value: number }) => (
  <Text color="gray.600">
    {value > 0 ? `${value} years` : "—"}
  </Text>
);

/**
 * TEXT: Financial formatting using US locale standards.
 */
export const CurrencyText = ({ value }: { value: number }) => (
  <Text color="green.600" fontWeight="bold" fontFamily="mono">
    {new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(value)}
  </Text>
);

/**
 * TEXT: Date display leveraging centralized date formatting utility.
 */
export const DateText = ({ dateString }: { dateString: string }) => {
  const formatted = formatDateDisplay(dateString);
  return <Text color="fg.muted" fontSize="sm">{formatted}</Text>;
};

/**
 * MOLECULE: Combined identity block showing employee avatar and name.
 */
export const EmployeeIdentity = ({ name, avatar }: { name: string, avatar?: string }) => (
  <HStack gap="3">
    <ChakraAvatar.Root size="sm">
      <ChakraAvatar.Fallback name={name} />
      <ChakraAvatar.Image src={avatar} alt={name} />
    </ChakraAvatar.Root>
    <Text fontWeight="medium" fontSize={{ base: "xs", md: "sm" }}>
      {name}
    </Text>
  </HStack>
);

/**
 * BADGE: Visual indicator for departments and organizational units.
 */
export const DeptBadge = ({ children }: { children: React.ReactNode }) => (
  <Badge variant="subtle" colorPalette="blue" size="xs" px="2">
    {children}
  </Badge>
);