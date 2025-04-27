"use client";

import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath, Bar } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { LinearGradient } from "@visx/gradient";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
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
  // Calculate bounds
  const innerWidth = width ? width - margin.left - margin.right : 0;
  const innerHeight = height ? height - margin.top - margin.bottom : 0;

  // Tooltip state
  const {
    showTooltip: handleShowTooltip,
    hideTooltip: handleHideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
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
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format value for tooltip
  const formatValue = (value: number) => {
    return value.toLocaleString();
  };

  // Handle tooltip
  const handleTooltip = (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
  ) => {
    if (!showTooltip) return;

    const { x } = localPoint(event) || { x: 0 };
    const x0 = timeScale.invert(x - margin.left);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];

    if (!d0 || !d1) return;

    const d =
      x0.getTime() - getDate(d0).getTime() >
      getDate(d1).getTime() - x0.getTime()
        ? d1
        : d0;

    handleShowTooltip({
      tooltipData: d,
      tooltipLeft: timeScale(getDate(d)),
      tooltipTop: valueScale(getValue(d)),
    });

    if (onHover) onHover(d);
  };

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
    <div>
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

          {/* Overlay for tooltip */}
          <Bar
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => {
              handleHideTooltip();
              if (onHover) onHover(null);
            }}
          />

          {/* Tooltip indicator */}
          {tooltipData && (
            <g>
              <circle
                cx={timeScale(getDate(tooltipData))}
                cy={valueScale(getValue(tooltipData))}
                r={4}
                fill="white"
                stroke={lineColor}
                strokeWidth={2}
                pointerEvents="none"
              />
              <line
                x1={timeScale(getDate(tooltipData))}
                y1={0}
                x2={timeScale(getDate(tooltipData))}
                y2={innerHeight}
                stroke={lineColor}
                strokeWidth={1}
                strokeDasharray="4,4"
                strokeOpacity={0.5}
                pointerEvents="none"
              />
            </g>
          )}
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipData && showTooltip && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop - 40}
          left={tooltipLeft + margin.left}
          style={{
            backgroundColor: "white",
            color: "#333",
            borderRadius: "6px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "8px 12px",
            fontSize: "12px",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
            zIndex: 100,
          }}
        >
          <div className="font-medium">{formatDate(getDate(tooltipData))}</div>
          <div className="text-blue-600 font-semibold">
            {formatValue(getValue(tooltipData))} clicks
          </div>
          {tooltipData.label && (
            <div className="text-gray-500 text-xs">{tooltipData.label}</div>
          )}
        </TooltipWithBounds>
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
