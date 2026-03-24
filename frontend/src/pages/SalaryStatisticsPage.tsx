/**
 * @module SalaryStatisticsPage
 * Analytics view dedicated to displaying salary distribution across the organization.
 * Visualizes how many employees fall into specific salary brackets.
 */

"use client"

import { Container, Center, Spinner, Text, Stack } from "@chakra-ui/react";
import { useAnalytics } from "@/services/hooks/useAnalytics";
import { StatisticsChart } from "@/components/StatisticsChart";

/**
 * Page component for Salary Analytics.
 * Handles distribution data for financial overview.
 */
const SalaryStatisticsPage = () => {
  // Fetch processed salary range data
  const chartData = useAnalytics('salary');

  // --- Loading State ---
  // Ensuring smooth UX during data aggregation
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
  // Actionable feedback if no salary records exist
  if (chartData.length === 0) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="2">
          <Text fontSize="lg" fontWeight="medium">No salary data available</Text>
          <Text color="fg.muted">Ensure employee salary information is correctly populated.</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      <StatisticsChart
        title="Salary Distribution"
        data={chartData}
        labelY="Employees"
        // Mapping keys to the salary distribution object structure
        dataKeyX="xValue"        // Range labels (e.g., "50k - 60k")
        dataKeyY="yValue"        // Number of employees in that range
        tooltipLabelKey="tooltipValue" // Descriptive text for tooltip
      />
    </Container>
  );
};

export default SalaryStatisticsPage;