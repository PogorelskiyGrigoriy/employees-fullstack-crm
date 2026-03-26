/**
 * @module SalaryStatisticsPage
 */

"use client"

import { Container, Center, Spinner, Text, Stack } from "@chakra-ui/react";
import { useStatistics } from "@/services/hooks/use-statistics";
import { StatisticsChart } from "@/components/StatisticsChart";

const SalaryStatisticsPage = () => {
  const { data, isLoading } = useStatistics();
  const chartData = data?.salaryDistribution ?? [];

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
          <Text fontSize="lg" fontWeight="medium">No salary data available</Text>
          <Text color="fg.muted">Statistics will appear once employees are added.</Text>
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
        dataKeyX="xValue"
        dataKeyY="yValue"
        tooltipLabelKey="tooltipValue"
      />
    </Container>
  );
};

export default SalaryStatisticsPage;