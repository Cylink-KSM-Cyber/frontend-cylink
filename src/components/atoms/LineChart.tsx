import React, { useState } from "react";
import { ChartDataPoint } from "@/interfaces/dashboard";

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  className?: string;
  showTooltip?: boolean;
  lineColor?: string;
  isLoading?: boolean;
}

/**
 * LineChart Component
 * A simple SVG-based line chart with tooltips and loading state
 */
const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  width = 600,
  className = "",
  showTooltip = true,
  lineColor = "#3b82f6",
  isLoading = false,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);

  if (isLoading) {
    return (
      <div
        className={`w-full h-${height} bg-white rounded-lg p-4 animate-pulse ${className}`}
      >
        <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-4"></div>
        <div className="h-full bg-gray-100 rounded-lg">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`w-full h-${height} flex items-center justify-center bg-white rounded-lg p-4 ${className}`}
      >
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Calculate dimensions
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min/max values
  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values) * 1.1; // Add 10% padding
  const minValue = Math.min(0, ...values); // Start from 0 or lower if negative values exist

  // Scale values to chart dimensions
  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth;
  const yScale = (value: number) =>
    chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  // Generate path data
  const linePath = data
    .map((d, i) => {
      const x = xScale(i) + padding.left;
      const y = yScale(d.value) + padding.top;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");

  // Generate area path (for gradient fill)
  const areaPath = [
    ...data.map((d, i) => {
      const x = xScale(i) + padding.left;
      const y = yScale(d.value) + padding.top;
      return `${i === 0 ? "M" : "L"} ${x},${y}`;
    }),
    `L ${padding.left + chartWidth},${yScale(minValue) + padding.top}`,
    `L ${padding.left},${yScale(minValue) + padding.top}`,
    "Z",
  ].join(" ");

  // Generate x-axis labels (show only a subset to avoid crowding)
  const xLabels = data.filter(
    (_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1
  );

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Handle mouse interactions
  const handleMouseEnter = (point: ChartDataPoint) => {
    setHoveredPoint(point);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Gradient ID
  const gradientId = `line-chart-gradient-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  return (
    <div className={`relative ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        {/* Define gradient for area fill */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {showTooltip &&
          data.map((point, i) => (
            <circle
              key={i}
              cx={xScale(i) + padding.left}
              cy={yScale(point.value) + padding.top}
              r="4"
              fill="white"
              stroke={lineColor}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-150"
              style={{ opacity: hoveredPoint === point ? 1 : 0 }}
              onMouseEnter={() => handleMouseEnter(point)}
              onMouseLeave={handleMouseLeave}
            />
          ))}

        {/* X-axis line */}
        <line
          x1={padding.left}
          y1={yScale(minValue) + padding.top}
          x2={padding.left + chartWidth}
          y2={yScale(minValue) + padding.top}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <g key={i}>
            <text
              x={xScale(data.indexOf(label)) + padding.left}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {formatDate(label.date)}
            </text>
          </g>
        ))}

        {/* Y-axis line */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#e5e7eb"
          strokeWidth="1"
        />

        {/* Y-axis labels (only show a few) */}
        {[0, 0.25, 0.5, 0.75, 1].map((percentage, i) => {
          const value = minValue + (maxValue - minValue) * percentage;
          return (
            <g key={i}>
              <text
                x={padding.left - 5}
                y={yScale(value) + padding.top}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {Math.round(value)}
              </text>
              <line
                x1={padding.left}
                y1={yScale(value) + padding.top}
                x2={padding.left + chartWidth}
                y2={yScale(value) + padding.top}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div
          className="absolute bg-white text-xs shadow-md rounded-md p-2 transform -translate-x-1/2 pointer-events-none z-10"
          style={{
            left: `${xScale(data.indexOf(hoveredPoint)) + padding.left}px`,
            top: `${yScale(hoveredPoint.value) + padding.top - 40}px`,
          }}
        >
          <div className="font-medium">{formatDate(hoveredPoint.date)}</div>
          <div className="text-gray-700">
            {hoveredPoint.label || hoveredPoint.value}
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
