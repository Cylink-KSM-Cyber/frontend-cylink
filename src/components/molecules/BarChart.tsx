import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleOrdinal, scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ParentSize } from "@visx/responsive";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  width: number;
  height: number;
  title?: string;
  colorScheme?: string[];
  margin?: { top: number; right: number; bottom: number; left: number };
}

const defaultMargin = { top: 20, right: 30, bottom: 80, left: 60 };
const defaultColors = ["#3b82f6", "#1e40af", "#1d4ed8", "#2563eb", "#3730a3"];

/**
 * Bar Chart Component
 * @description Displays data using horizontal or vertical bars
 * @param data - Array of data points with labels and values
 * @param width - Chart width
 * @param height - Chart height
 * @param title - Chart title
 * @param colorScheme - Array of colors for bars
 * @returns React component
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  title,
  colorScheme = defaultColors,
  margin = defaultMargin,
}) => {
  // Bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Accessors
  const getLabel = (d: BarChartData) => d.label;
  const getValue = (d: BarChartData) => d.value;

  // Scales
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getLabel),
        padding: 0.4,
      }),
    [xMax, data]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getValue))],
        nice: true,
      }),
    [yMax, data]
  );

  const colorScale = useMemo(
    () =>
      scaleOrdinal<string, string>({
        domain: data.map(getLabel),
        range: colorScheme,
      }),
    [data, colorScheme]
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {title}
        </h3>
      )}
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Bars */}
          {data.map((d) => {
            const label = getLabel(d);
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - (yScale(getValue(d)) ?? 0);
            const barX = xScale(label);
            const barY = yMax - barHeight;

            return (
              <motion.g
                key={`bar-${label}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: data.indexOf(d) * 0.1 }}
                style={{
                  transformOrigin: `${barX! + barWidth / 2}px ${yMax}px`,
                }}
              >
                <Bar
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  fill={d.color || colorScale(label)}
                  rx={4}
                />
                <text
                  x={barX! + barWidth / 2}
                  y={barY - 5}
                  textAnchor="middle"
                  fill="#374151"
                  fontSize={12}
                  fontWeight="bold"
                >
                  {getValue(d).toLocaleString()}
                </text>
              </motion.g>
            );
          })}

          {/* Axes */}
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke="#6b7280"
            tickStroke="#6b7280"
            tickLabelProps={{
              fill: "#6b7280",
              fontSize: 12,
              textAnchor: "middle",
              angle: -45,
              dx: "-0.25em",
              dy: "0.25em",
            }}
          />
          <AxisLeft
            scale={yScale}
            stroke="#6b7280"
            tickStroke="#6b7280"
            tickLabelProps={{
              fill: "#6b7280",
              fontSize: 12,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            }}
          />
        </Group>
      </svg>
    </div>
  );
};

/**
 * Responsive Bar Chart Wrapper
 */
const ResponsiveBarChart: React.FC<{
  data: BarChartData[];
  title?: string;
  colorScheme?: string[];
  height?: number;
}> = ({ data, title, colorScheme, height = 300 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-lg border border-gray-200 p-4"
    >
      <ParentSize>
        {({ width }) => (
          <BarChart
            data={data}
            width={width}
            height={height}
            title={title}
            colorScheme={colorScheme}
          />
        )}
      </ParentSize>
    </motion.div>
  );
};

export type { BarChartData };
export default ResponsiveBarChart;
