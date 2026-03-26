/**
 * @module DepartmentStatisticsPage
 */

"use client"

import { Container, Heading, VStack, Box, Center, Spinner, Text } from "@chakra-ui/react"
import { useDepartmentStats } from "@/services/hooks/use-department-stats"
import { DepartmentsTable } from "@/components/DepartmentsTable"

const DepartmentStatisticsPage = () => {
  const { departmentsInfo, isLoading } = useDepartmentStats()

  if (isLoading) {
    return (
      <Center h="60vh">
        <VStack gap="4">
          <Spinner size="xl" color="blue.500" borderWidth="4px" />
          <Text color="fg.muted" fontWeight="medium">Fetching analytics...</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Container maxW="6xl" py={{ base: "6", md: "10" }}>
      <VStack align="stretch" gap="8">
        <Box>
          <Heading size="2xl" letterSpacing="tight">Department Statistics</Heading>
          <Text color="fg.muted" mt="2"> Headcount, average salary, and age per department. </Text>
        </Box>

        <Box borderWidth="1px" borderRadius="2xl" bg="bg.panel" shadow="sm">
          <DepartmentsTable departmentsInfo={departmentsInfo} />
        </Box>
      </VStack>
    </Container>
  )
}

export default DepartmentStatisticsPage