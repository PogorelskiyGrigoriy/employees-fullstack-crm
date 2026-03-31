/**
 * @module DepartmentStatisticsPage
 * Finalized analytics view for department-level metrics.
 * Integrated with the Midnight Slate design system and shared organisms.
 */

"use client"

import { Container } from "@chakra-ui/react"
import { LuLayoutDashboard } from "react-icons/lu"

import { useDepartmentStats } from "@/services/hooks/use-department-stats"
import { DepartmentsTable } from "@/components/DepartmentsTable"
import { PageHeader } from "@/components/shared/molecules/PageHeader"
import { AppPanel } from "@/components/shared/atoms/AppPanel"
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper"

const DepartmentStatisticsPage = () => {
  // Destructuring all necessary states from the hook
  const { 
    departmentsInfo, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useDepartmentStats()

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      {/* 1. Standardized Page Header */}
      <PageHeader 
        title="Department Statistics"
        description="Headcount, average salary, and age demographics per organizational unit."
        icon={LuLayoutDashboard}
      />

      {/* 2. Logic-heavy state management wrapper */}
      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!departmentsInfo || departmentsInfo.length === 0}
        emptyMessage="No department data found"
        emptyDescription="Statistics will be generated once employees are assigned to departments."
        onRetry={refetch}
      >
        {/* 3. Success State: Table wrapped in our standard AppPanel */}
        <AppPanel p={0} overflow="hidden">
          <DepartmentsTable departmentsInfo={departmentsInfo!} />
        </AppPanel>
      </DataStateWrapper>
    </Container>
  )
}

export default DepartmentStatisticsPage