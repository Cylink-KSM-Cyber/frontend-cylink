"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Group } from "@visx/group";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { LinearGradient } from "@visx/gradient";
import { useTooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { ChartDataPoint } from "@/interfaces/dashboard";
import { ParentSize } from "@visx/responsive";

// Define chart margins
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

// Date accessor function
const getDate = (d: ChartDataPoint) => new Date(d.date);
const getValue = (d: ChartDataPoint) => d.value;
const bisectDate = bisector<ChartDataPoint, Date>((d) => new Date(d.date)).left;

// Fixed tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  background: "white",
  border: "1px solid #ddd",
  color: "black",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  borderRadius: "4px",
  padding: "8px 12px",
  fontSize: "12px",
  fontFamily: "sans-serif",
  lineHeight: "1.4",
  zIndex: 1000,
  minWidth: "100px",
  textAlign: "center" as const,
};

// Define pointer-events const for type safety
const pointerEventsNone = "none" as const;

export type VisxLineChartProps = {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  lineColor?: string;
  areaColor?: string;
  axisColor?: string;
  showTooltip?: boolean;
  className?: string;
  isLoading?: boolean;
  onHover?: (dataPoint: ChartDataPoint | null) => void;
};

/**
 * Internal LineChart component without responsive wrapper
 * This component is wrapped with ParentSize for responsiveness
 */
const LineChartBase = ({
  data,
  width,
  height,
  lineColor = "#3b82f6", // blue-500
  areaColor = "#3b82f6", // blue-500
  axisColor = "#9ca3af", // gray-400
  showTooltip = true,
  isLoading = false,
  onHover,
}: VisxLineChartProps) => {
  // State to track active tooltip and its position
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Calculate bounds
  const innerWidth = width ? width - margin.left - margin.right : 0;
  const innerHeight = height ? height - margin.top - margin.bottom : 0;

  // Tooltip state with visx useTooltip hook
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip: handleShowTooltip,
    hideTooltip: handleHideTooltip,
  } = useTooltip<ChartDataPoint>();

  // Create scales
  const timeScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: [
          Math.min(...data.map((d) => getDate(d).getTime())),
          Math.max(...data.map((d) => getDate(d).getTime())),
        ],
      }),
    [innerWidth, data]
  );

  const valueScale = useMemo(() => {
    const values = data.map(getValue);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Add 10% padding to the top
    const yMax = maxValue + (maxValue - minValue) * 0.1;
    // Use 0 as min value unless we have negative values
    const yMin = Math.min(0, minValue);

    return scaleLinear({
      range: [innerHeight, 0],
      domain: [yMin, yMax],
      nice: true,
    });
  }, [innerHeight, data]);

  // Format date for tooltip
  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, []);

  // Format value for tooltip
  const formatValue = useCallback((value: number) => {
    return value.toLocaleString();
  }, []);

  // Handle tooltip - simplified and more robust
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
    ) => {
      // Don't do anything if showTooltip is false
      if (!showTooltip) return;

      try {
        // Get the mouse position relative to the SVG
        const { x } = localPoint(event) || { x: 0 };

        // Convert x position to date
        const xValue = timeScale.invert(x - margin.left);

        // Find the closest data point
        const index = bisectDate(data, xValue, 1);

        // Make sure we have at least two points to compare
        if (index <= 0 || index >= data.length) return;

        const d0 = data[index - 1];
        const d1 = data[index];

        // Determine the closest point to the mouse
        const d =
          xValue.getTime() - getDate(d0).getTime() >
          getDate(d1).getTime() - xValue.getTime()
            ? d1
            : d0;

        // Get the scaled positions for the tooltip
        const left = timeScale(getDate(d));
        const top = valueScale(getValue(d));

        // Show the tooltip at the proper position
        handleShowTooltip({
          tooltipData: d,
          tooltipLeft: left,
          tooltipTop: top,
        });

        // Make tooltip visible and call onHover if needed
        setTooltipVisible(true);
        if (onHover) onHover(d);

        // Log for debugging
        console.log("Tooltip shown", {
          date: d.date,
          value: d.value,
          left,
          top,
        });
      } catch (error) {
        console.error("Error showing tooltip:", error);
        setTooltipVisible(false);
        handleHideTooltip();
      }
    },
    [data, timeScale, valueScale, showTooltip, handleShowTooltip, onHover]
  );

  // Mouse leave handler to hide tooltip
  const handleMouseLeave = useCallback(() => {
    setTooltipVisible(false);
    handleHideTooltip();
    if (onHover) onHover(null);
  }, [handleHideTooltip, onHover]);

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full animate-pulse">
        <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-4"></div>
        <div className="h-full bg-gray-100 rounded-lg">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Gradient for area */}
          <LinearGradient
            id="area-gradient"
            from={areaColor}
            to={areaColor}
            fromOpacity={0.2}
            toOpacity={0.01}
          />

          {/* Grid rows */}
          <GridRows
            scale={valueScale}
            width={innerWidth}
            numTicks={5}
            stroke="#e5e7eb" // gray-200
            strokeDasharray="4,4"
            strokeOpacity={0.7}
          />

          {/* Y-axis */}
          <AxisLeft
            scale={valueScale}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => ({
              fill: axisColor,
              fontSize: 11,
              textAnchor: "end",
              dx: "-0.5em",
              dy: "0.3em",
            })}
            numTicks={5}
          />

          {/* X-axis */}
          <AxisBottom
            top={innerHeight}
            scale={timeScale}
            stroke={axisColor}
            tickStroke={axisColor}
            tickLabelProps={() => ({
              fill: axisColor,
              fontSize: 11,
              textAnchor: "middle",
              dy: "1em",
            })}
            numTicks={5}
          />

          {/* Area */}
          <AreaClosed
            data={data}
            x={(d) => timeScale(getDate(d)) ?? 0}
            y={(d) => valueScale(getValue(d)) ?? 0}
            yScale={valueScale}
            strokeWidth={0}
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />

          {/* Line */}
          <LinePath
            data={data}
            x={(d) => timeScale(getDate(d)) ?? 0}
            y={(d) => valueScale(getValue(d)) ?? 0}
            stroke={lineColor}
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {/* Tooltip indicator - shows if we have tooltip data */}
          {tooltipData &&
            tooltipLeft !== undefined &&
            tooltipTop !== undefined &&
            tooltipVisible && (
              <g>
                <circle
                  cx={tooltipLeft}
                  cy={tooltipTop}
                  r={5}
                  fill="white"
                  stroke={lineColor}
                  strokeWidth={2}
                  pointerEvents="none"
                />
                <line
                  x1={tooltipLeft}
                  y1={0}
                  x2={tooltipLeft}
                  y2={innerHeight}
                  stroke={lineColor}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  strokeOpacity={0.5}
                  pointerEvents="none"
                />
              </g>
            )}

          {/* Overlay for tooltip */}
          <Bar
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={handleMouseLeave}
          />
        </Group>
      </svg>

      {/* Simplified but robust tooltip */}
      {tooltipData &&
        tooltipLeft !== undefined &&
        tooltipTop !== undefined &&
        tooltipVisible && (
          <div
            style={{
              position: "absolute",
              top: tooltipTop + margin.top - 45,
              left: tooltipLeft + margin.left,
              transform: "translate(-50%, -100%)",
              pointerEvents: pointerEventsNone,
              ...tooltipStyles,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#6b7280", fontSize: "11px" }}>
                {formatDate(getDate(tooltipData))}
              </div>
              <div
                style={{ color: "#3b82f6", fontWeight: 600, marginTop: "2px" }}
              >
                {formatValue(getValue(tooltipData))} clicks
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

/**
 * Responsive LineChart Component using visx
 * Renders a line chart with tooltip and responsive layout
 */
const VisxLineChart = ({ data, height = 300, ...rest }: VisxLineChartProps) => {
  return (
    <ParentSize>
      {({ width }) => (
        <LineChartBase data={data} width={width} height={height} {...rest} />
      )}
    </ParentSize>
  );
};

export default VisxLineChart;
