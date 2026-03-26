/**
 * @module AgeStatisticsPage
 */

"use client"

import { Container, Center, Spinner, Text, Stack } from "@chakra-ui/react";
import { useStatistics } from "@/services/hooks/useStatistics";
import { StatisticsChart } from "@/components/StatisticsChart";

const AgeStatisticsPage = () => {
  const { data, isLoading } = useStatistics();
  const chartData = data?.ageDistribution ?? [];

  if (isLoading) {
    return (
      <Center h="60vh">
        <Spinner size="xl" color="blue.500" borderWidth="4px" />
      </Center>
    );
  }

  if (chartData.length === 0) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="2">
          <Text fontSize="lg" fontWeight="medium">No age data available</Text>
          <Text color="fg.muted">Add employees to see the demographics chart.</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      <StatisticsChart
        title="Age Distribution"
        data={chartData}
        dataKeyX="xValue"
        dataKeyY="yValue"
        labelY="Employees"
        tooltipLabelKey="tooltipValue"
      />
    </Container>
  );
};

export default AgeStatisticsPage;