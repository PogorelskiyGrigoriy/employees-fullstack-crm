/**
 * @module StatisticsChart
 * A generic, responsive bar chart component.
 * Deeply integrated with Chakra UI theme tokens for consistent styling of colors, 
 * typography, and spacing.
 */

"use client";

import { useMemo } from "react";
import { Box, Heading, Container, useToken } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { StatsChartProps } from "@/schemas/statsInterface.schema";

/** Constant margin config to maximize usable chart area while keeping labels visible */
const CHART_MARGIN = { top: 10, right: 10, left: -20, bottom: 0 } as const;

export const StatisticsChart = ({
  title,
  data,
  dataKeyX = "xValue",
  dataKeyY = "yValue",
  labelY = "Employees",
  tooltipLabelKey = "tooltipValue",
}: StatsChartProps) => {
  /**
   * Accessing Chakra UI Design Tokens:
   * This ensures the chart colors match the rest of the application's UI perfectly.
   */
  const [accent, grayMuted, gridColor, textPrimary] = useToken("colors", [
    "blue.500",
    "fg.muted",
    "border.subtle",
    "fg.emphasized",
  ]);

  /**
   * Performance Optimization:
   * Memoizing styles to prevent unnecessary Recharts recalculations 
   * unless the primary text color changes.
   */
  const tooltipStyles = useMemo(() => ({
    contentStyle: {
      borderRadius: "12px",
      border: "none",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      backgroundColor: "var(--chakra-colors-bg-panel)", // CSS Variable for dynamic dark/light mode
      padding: "8px 12px",
    },
    labelStyle: {
      color: textPrimary,
      fontWeight: "bold",
      fontSize: "13px",
      marginBottom: "2px",
    },
    itemStyle: { 
      color: textPrimary, 
      fontSize: "12px",
      padding: "0" 
    }
  }), [textPrimary]);

  return (
    <Container>
      <Heading 
        size={{ base: "md", md: "xl" }} 
        mb={{ base: "4", md: "6" }} 
        fontWeight="bold"
        letterSpacing="tight"
      >
        {title}
      </Heading>

      <Box
        p={{ base: "2", md: "5" }}
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="2xl"
        bg="bg.panel"
        height={{ base: "280px", md: "400px" }}
        shadow="xs"
        position="relative"
      >
        <ResponsiveContainer>
          <BarChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false} // Clean look with horizontal grid lines only
              stroke={gridColor}
            />
            
            <XAxis
              dataKey={dataKeyX as string}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: grayMuted }}
              dy={10}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: grayMuted }}
              allowDecimals={false} // Best for headcount/integer statistics
              dx={-5}
            />
            
            <Tooltip
              cursor={{ fill: gridColor, opacity: 0.4 }}
              contentStyle={tooltipStyles.contentStyle}
              labelStyle={tooltipStyles.labelStyle}
              itemStyle={tooltipStyles.itemStyle}
              /** Logic to pull custom descriptive text into the tooltip header */
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.[tooltipLabelKey as string] ?? ""
              }
            />
            
            <Bar
              dataKey={dataKeyY as string}
              name={labelY}
              fill={accent}
              radius={[4, 4, 0, 0]} // Modern rounded top corners
              barSize={32}
              minPointSize={3} // Ensures very small bars remain visible/interactable
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  );
};