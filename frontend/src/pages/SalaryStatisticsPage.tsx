/**
 * @module SalaryStatisticsPage
 * Finalized salary analytics view.
 * Fully integrated with the DataStateWrapper and Midnight Slate theme.
 */

"use client"

import { Container } from "@chakra-ui/react";
import { LuTrendingUp } from "react-icons/lu";

import { useStatistics } from "@/services/hooks/use-statistics";
import { StatisticsChart } from "@/components/StatisticsChart";
import { PageHeader } from "@/components/shared/molecules/PageHeader";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";

const SalaryStatisticsPage = () => {
  // Extracting all necessary states from the query hook
  const { data, isLoading, isError, error, refetch } = useStatistics();
  const chartData = data?.salaryDistribution ?? [];

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      {/* 1. Standardized Page Header */}
      <PageHeader 
        title="Salary Distribution"
        description="Comprehensive analysis of monthly salary ranges across the organization."
        icon={LuTrendingUp}
      />

      {/* 2. Declarative State Management */}
      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={chartData.length === 0}
        emptyMessage="No salary data available"
        emptyDescription="Salary demographics will appear once employees with financial records are added."
        onRetry={refetch}
      >
        {/* 3. The Chart (Success path) */}
        <StatisticsChart
          title="Monthly Salaries"
          data={chartData}
          labelY="Employees"
          dataKeyX="xValue"
          dataKeyY="yValue"
          tooltipLabelKey="tooltipValue"
        />
      </DataStateWrapper>
    </Container>
  );
};

export default SalaryStatisticsPage;