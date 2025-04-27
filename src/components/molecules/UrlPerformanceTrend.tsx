import React from "react";
import LineChart from "@/components/atoms/LineChart";
import { UrlPerformanceData } from "@/interfaces/dashboard";

interface UrlPerformanceTrendProps {
  performanceData: UrlPerformanceData;
  className?: string;
}

/**
 * UrlPerformanceTrend Component
 * Displays a line chart showing URL performance trends over time
 */
const UrlPerformanceTrend: React.FC<UrlPerformanceTrendProps> = ({
  performanceData,
  className = "",
}) => {
  const { timeSeriesData, isLoading, isError } = performanceData;

  // Error state
  if (isError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          URL Performance Trends
        </h2>
        <div className="flex items-center justify-center h-48 text-red-500">
          <p>Failed to load performance data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          URL Performance Trends
        </h2>
        <div className="flex space-x-4">
          {/* This could be expanded with toggles for different metrics */}
          <span className="text-sm text-blue-600 font-medium">Clicks</span>
        </div>
      </div>

      <div className="h-64">
        <LineChart
          data={timeSeriesData}
          height={250}
          isLoading={isLoading}
          lineColor="#3b82f6"
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default UrlPerformanceTrend;
