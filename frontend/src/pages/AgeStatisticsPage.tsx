/**
 * @module AgeStatisticsPage
 * Visualizes employee age distribution using standardized state wrappers.
 */

"use client"

import { Container } from "@chakra-ui/react";
import { LuTrendingUp } from "react-icons/lu";

import { useStatistics } from "@/services/hooks/use-statistics";
import { StatisticsChart } from "@/components/StatisticsChart";
import { PageHeader } from "@/shared/ui/molecules/PageHeader";
import { DataStateWrapper } from "@/shared/ui/organisms/DataStateWrapper";

const AgeStatisticsPage = () => {
  const { data, isLoading, isError, error, refetch } = useStatistics();
  const chartData = data?.ageDistribution ?? [];

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      {/* 1. Unified Page Header */}
      <PageHeader 
        title="Age Demographics"
        description="Detailed breakdown of the workforce by age groups."
        icon={LuTrendingUp}
      />

      {/* 2. Logic-heavy wrapper for API states */}
      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={chartData.length === 0}
        emptyMessage="No age data available"
        emptyDescription="Statistics will appear once employees with valid birth dates are added."
        onRetry={refetch}
      >
        {/* 3. The chart itself (The "Success" path) */}
        <StatisticsChart
          title="Age Distribution"
          data={chartData}
          dataKeyX="xValue"
          dataKeyY="yValue"
          labelY="Employees"
          tooltipLabelKey="tooltipValue"
        />
      </DataStateWrapper>
    </Container>
  );
};

export default AgeStatisticsPage;