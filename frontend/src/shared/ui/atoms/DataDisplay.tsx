/**
 * @module DataDisplay
 * Pure text formatting atoms using semantic tokens.
 */
import { Text } from "@chakra-ui/react";
import { formatDateDisplay } from "@crm/shared/utils/date-utils.js";

export const AgeText = ({ value }: { value: number }) => (
  <Text color="fg.muted">
    {value > 0 ? `${value} years` : "—"}
  </Text>
);

export const CurrencyText = ({ value }: { value: number }) => (
  <Text color="brand.500" fontWeight="bold" fontFamily="mono">
    {new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(value)}
  </Text>
);

export const DateText = ({ dateString }: { dateString: string }) => (
  <Text color="fg.muted" fontSize="sm">
    {formatDateDisplay(dateString)}
  </Text>
);