import React from "react";
import { CtrBreakdownData } from "@/interfaces/dashboard";
import { safeToFixed } from "@/utils/numberFormatting";

interface CtrBreakdownChartProps {
  breakdownData: CtrBreakdownData;
  className?: string;
}

/**
 * CtrBreakdownChart Component
 * Displays a bar chart showing CTR by different sources
 */
const CtrBreakdownChart: React.FC<CtrBreakdownChartProps> = ({
  breakdownData,
  className = "",
}) => {
  const { sourceData, isLoading, isError } = breakdownData;

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          CTR Breakdown
        </h2>
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
              <div className="ml-2 h-5 bg-gray-200 rounded-full flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          CTR Breakdown
        </h2>
        <div className="flex items-center justify-center h-48 text-red-500">
          <p>Failed to load CTR breakdown data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!sourceData || sourceData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          CTR Breakdown
        </h2>
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p>No CTR data available yet.</p>
          <p className="text-sm mt-2">
            Share your URLs to start collecting CTR data.
          </p>
        </div>
      </div>
    );
  }

  // Find max value for scaling
  const maxCtr = Math.max(...sourceData.map((item) => item.ctr)) * 1.1; // Add 10% padding

  // Generate bar chart
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        CTR Breakdown by Source
      </h2>

      <div className="space-y-4">
        {sourceData.map((item, index) => {
          // Calculate percentage width for bar
          const barWidth = (item.ctr / maxCtr) * 100;

          // Assign colors based on index
          const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-yellow-500",
            "bg-pink-500",
            "bg-indigo-500",
          ];
          const color = colors[index % colors.length];

          return (
            <div key={item.source} className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.source}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {safeToFixed(item.ctr, 1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${color}`}
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{item.clicks} clicks</span>
                <span>{item.impressions} impressions</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Average CTR</span>
          <span className="text-lg font-bold text-purple-600">
            {safeToFixed(
              sourceData.reduce((acc, item) => acc + item.ctr, 0) /
                sourceData.length,
              2
            )}
            %
          </span>
        </div>
      </div>
    </div>
  );
};

export default CtrBreakdownChart;
