/**
 * @module StatisticsChart
 * Refactored for the "Midnight Slate" design system.
 * Uses AppPanel for consistency and brand tokens for data visualization.
 */

"use client";

import { useMemo } from "react";
import { Heading, useToken, VStack } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { AppPanel } from "@/components/shared/atoms/AppPanel";
import type { StatsChartProps } from "@/types/stats";

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
   * 1. Dynamic Token Extraction:
   * Switching from 'blue.500' to our semantic 'brand.500'.
   */
  const [accent, grayMuted, gridColor, textPrimary, panelBg] = useToken("colors", [
    "brand.500",      // Main brand color for bars
    "fg.muted",       // Labels color
    "border.subtle",  // Grid lines
    "fg.emphasized",  // Tooltip text
    "bg.panel",       // Tooltip background
  ]);

  /**
   * 2. Premium Tooltip Styling:
   * Matching the Midnight Slate panel aesthetic.
   */
  const tooltipStyles = useMemo(() => ({
    contentStyle: {
      borderRadius: "12px",
      border: `1px solid ${gridColor}`,
      boxShadow: "var(--chakra-shadows-xl)",
      backgroundColor: panelBg,
      padding: "10px 14px",
    },
    labelStyle: {
      color: textPrimary,
      fontWeight: "800",
      fontSize: "13px",
      marginBottom: "4px",
      letterSpacing: "-0.02em",
    },
    itemStyle: { 
      color: accent, 
      fontSize: "12px",
      fontWeight: "600",
      padding: "0" 
    }
  }), [textPrimary, accent, gridColor, panelBg]);

  return (
    <VStack align="stretch" gap={5} width="full">
      {/* 3. Section Title with specific typography */}
      {title && (
        <Heading 
          size="md" 
          fontWeight="black" 
          letterSpacing="tight"
          color="fg.emphasized"
        >
          {title}
        </Heading>
      )}

      {/* 4. Themed Container: Replaced manual Box with AppPanel */}
      <AppPanel 
        height={{ base: "300px", md: "420px" }}
        p={{ base: "3", md: "6" }}
        position="relative"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={CHART_MARGIN}>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke={gridColor}
              opacity={0.6}
            />
            
            <XAxis
              dataKey={dataKeyX as string}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: grayMuted, fontWeight: 500 }}
              dy={12}
            />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: grayMuted, fontWeight: 500 }}
              allowDecimals={false}
              dx={-8}
            />
            
            <Tooltip
              cursor={{ fill: accent, opacity: 0.05 }} // Subtle highlight on hover
              contentStyle={tooltipStyles.contentStyle}
              labelStyle={tooltipStyles.labelStyle}
              itemStyle={tooltipStyles.itemStyle}
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.[tooltipLabelKey as string] ?? ""
              }
            />
            
            <Bar
              dataKey={dataKeyY as string}
              name={labelY}
              fill={accent}
              radius={[6, 6, 0, 0]} // Slightly smoother corners
              barSize={28} // More elegant bar width
              minPointSize={4}
              // Hover effect via CSS in JS
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </AppPanel>
    </VStack>
  );
};