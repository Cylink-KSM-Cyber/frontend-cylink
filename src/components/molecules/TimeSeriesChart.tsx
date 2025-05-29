import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Group } from "@visx/group";
import { LinePath, AreaClosed } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { Tooltip, withTooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { bisector } from "d3-array";
import { TimeSeriesDataPoint } from "@/interfaces/urlAnalytics";

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showTooltip?: (
    event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>
  ) => void;
  hideTooltip?: () => void;
  tooltipData?: TimeSeriesDataPoint;
  tooltipLeft?: number;
  tooltipTop?: number;
}

const margin = { top: 20, right: 30, bottom: 40, left: 60 };

/**
 * Time Series Chart Component
 * @description Displays analytics data over time using line and area charts
 * @param data - Array of time series data points
 * @param width - Chart width
 * @param height - Chart height
 * @returns React component
 */
const TimeSeriesChart: React.FC<TimeSeriesChartProps> =
  withTooltip<TimeSeriesChartProps>(
    ({
      data,
      width,
      height,
      showTooltip,
      hideTooltip,
      tooltipData,
      tooltipLeft,
      tooltipTop,
    }) => {
      // Bounds
      const xMax = width - margin.left - margin.right;
      const yMax = height - margin.top - margin.bottom;

      // Date and click accessors
      const getDate = (d: TimeSeriesDataPoint) => new Date(d.date);
      const getClicks = (d: TimeSeriesDataPoint) => d.clicks;

      // Scales
      const dateScale = useMemo(
        () =>
          scaleTime<number>({
            range: [0, xMax],
            domain:
              data.length > 0
                ? [
                    Math.min(...data.map(getDate).map((d) => d.valueOf())),
                    Math.max(...data.map(getDate).map((d) => d.valueOf())),
                  ]
                : [new Date().valueOf(), new Date().valueOf()],
          }),
        [xMax, data]
      );

      const clicksScale = useMemo(
        () =>
          scaleLinear<number>({
            range: [yMax, 0],
            domain:
              data.length > 0
                ? [0, Math.max(...data.map(getClicks))]
                : [0, 100],
            nice: true,
          }),
        [yMax, data]
      );

      // Tooltip handler
      const handleTooltip = useMemo(
        () =>
          (
            event: React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement>
          ) => {
            if (!showTooltip) return;

            const { x } = localPoint(event) || { x: 0 };
            const x0 = dateScale.invert(x - margin.left);
            const bisectDate = bisector<TimeSeriesDataPoint, Date>((d) =>
              getDate(d)
            ).left;
            const index = bisectDate(data, x0, 1);
            const d0 = data[index - 1];
            const d1 = data[index];
            let d = d0;
            if (d1 && getDate(d1)) {
              d =
                x0.valueOf() - getDate(d0).valueOf() >
                getDate(d1).valueOf() - x0.valueOf()
                  ? d1
                  : d0;
            }
            showTooltip({
              tooltipData: d,
              tooltipLeft: dateScale(getDate(d)),
              tooltipTop: clicksScale(getClicks(d)),
            });
          },
        [showTooltip, dateScale, clicksScale, data]
      );

      if (!data || data.length === 0) {
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        );
      }

      return (
        <div className="relative">
          <svg width={width} height={height}>
            <Group left={margin.left} top={margin.top}>
              {/* Grid */}
              <GridRows
                scale={clicksScale}
                width={xMax}
                height={yMax}
                stroke="#e5e7eb"
                strokeOpacity={0.5}
              />
              <GridColumns
                scale={dateScale}
                width={xMax}
                height={yMax}
                stroke="#e5e7eb"
                strokeOpacity={0.5}
              />

              {/* Area */}
              <AreaClosed<TimeSeriesDataPoint>
                data={data}
                x={(d) => dateScale(getDate(d)) ?? 0}
                y={(d) => clicksScale(getClicks(d)) ?? 0}
                yScale={clicksScale}
                strokeWidth={2}
                stroke="url(#area-gradient)"
                fill="url(#area-gradient)"
                fillOpacity={0.3}
              />

              {/* Line */}
              <LinePath<TimeSeriesDataPoint>
                data={data}
                x={(d) => dateScale(getDate(d)) ?? 0}
                y={(d) => clicksScale(getClicks(d)) ?? 0}
                stroke="#3b82f6"
                strokeWidth={2}
                strokeOpacity={0.8}
              />

              {/* Axes */}
              <AxisBottom
                top={yMax}
                scale={dateScale}
                numTicks={Math.min(data.length, 6)}
                stroke="#6b7280"
                tickStroke="#6b7280"
                tickLabelProps={{
                  fill: "#6b7280",
                  fontSize: 12,
                  textAnchor: "middle",
                }}
              />
              <AxisLeft
                scale={clicksScale}
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

              {/* Tooltip line */}
              {tooltipData && (
                <g>
                  <line
                    x1={tooltipLeft}
                    x2={tooltipLeft}
                    y1={0}
                    y2={yMax}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    strokeDasharray="3,3"
                    pointerEvents="none"
                  />
                  <circle
                    cx={tooltipLeft}
                    cy={tooltipTop}
                    r={4}
                    fill="#3b82f6"
                    pointerEvents="none"
                  />
                </g>
              )}

              {/* Overlay for mouse events */}
              <rect
                x={0}
                y={0}
                width={xMax}
                height={yMax}
                fill="transparent"
                onTouchStart={handleTooltip}
                onTouchMove={handleTooltip}
                onMouseMove={handleTooltip}
                onMouseLeave={() => hideTooltip?.()}
              />
            </Group>

            {/* Gradient Definition */}
            <defs>
              <linearGradient
                id="area-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </svg>

          {/* Tooltip */}
          {tooltipData && (
            <Tooltip
              top={tooltipTop! + margin.top}
              left={tooltipLeft! + margin.left}
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                border: "1px solid white",
                color: "white",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <div>
                <strong>
                  {new Date(tooltipData.date).toLocaleDateString()}
                </strong>
              </div>
              <div>Clicks: {tooltipData.clicks.toLocaleString()}</div>
            </Tooltip>
          )}
        </div>
      );
    }
  );

/**
 * Responsive Time Series Chart Wrapper
 */
const ResponsiveTimeSeriesChart: React.FC<{ data: TimeSeriesDataPoint[] }> = ({
  data,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-80 bg-white rounded-lg border border-gray-200 p-4"
    >
      <ParentSize>
        {({ width, height }) => (
          <TimeSeriesChart data={data} width={width} height={height} />
        )}
      </ParentSize>
    </motion.div>
  );
};

export default ResponsiveTimeSeriesChart;
