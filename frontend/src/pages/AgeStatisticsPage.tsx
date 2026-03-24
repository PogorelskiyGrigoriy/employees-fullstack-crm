/**
 * @module AgeStatisticsPage
 * Analytics view dedicated to displaying employee age demographics.
 * Utilizes a specialized analytics hook to fetch pre-formatted distribution data.
 */

"use client"

import { Container, Center, Spinner, Text, Stack } from "@chakra-ui/react";
import { useAnalytics } from "@/services/hooks/useAnalytics";
import { StatisticsChart } from "@/components/StatisticsChart";

/**
 * Page component that renders the Age Distribution chart.
 * Manages loading and empty states specific to the age analytics context.
 */
const AgeStatisticsPage = () => {
  // Fetch processed chart data via the analytics hook
  const chartData = useAnalytics('age');

  // --- Loading State ---
  // Centered spinner ensures a smooth transition while the store calculates distributions
  if (!chartData) {
    return (
      <Center h="60vh">
        <Spinner
          size="xl"
          color="blue.500"
          borderWidth="4px"
        />
      </Center>
    );
  }

  // --- Empty State ---
  // Handles cases where the employee list is empty, providing actionable feedback
  if (chartData.length === 0) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="2">
          <Text fontSize="lg" fontWeight="medium">No age data available</Text>
          <Text color="fg.muted">Add employees to see the distribution chart.</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      <StatisticsChart
        title="Age Distribution"
        data={chartData}
        dataKeyX="xValue"      // Key for the X-axis (e.g., "18-25")
        dataKeyY="yValue"      // Key for the Y-axis (count)
        labelY="Employees"
        tooltipLabelKey="tooltipValue" // Label for the tooltip header
      />
    </Container>
  );
};

export default AgeStatisticsPage;