import React, { useState, useMemo } from "react";
import VisxLineChart from "@/components/atoms/VisxLineChart";
import { useUrlTotalClicks } from "@/hooks/url/useUrlTotalClicks";
import { UrlTotalClicksParams } from "@/interfaces/urlTotalClicks";

interface UrlPerformanceTrendProps {
  className?: string;
}

/**
 * UrlPerformanceTrend Component
 * Displays a line chart showing URL performance trends over time using visx
 */
const UrlPerformanceTrend: React.FC<UrlPerformanceTrendProps> = ({
  className = "",
}) => {
  // Time period selection state
  const [timePeriod, setTimePeriod] = useState<"7" | "14" | "30" | "90">("30");

  // Parameters for the API call - memoized to prevent recreation on each render
  const apiParams = useMemo<UrlTotalClicksParams>(
    () => ({
      comparison: timePeriod,
      group_by: "day",
      limit: parseInt(timePeriod),
      page: 1,
    }),
    [timePeriod]
  );

  // Fetch total clicks data using our custom hook
  const { timeSeriesData, data, isLoading, isError } =
    useUrlTotalClicks(apiParams);

  // Handle time period change
  const handleTimePeriodChange = (period: "7" | "14" | "30" | "90") => {
    setTimePeriod(period);
  };

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

  // Format change percentage with plus sign and rounding
  const formatChangePercentage = (value: number | undefined) => {
    if (value === undefined) return "—";
    const formattedValue = value.toFixed(2);
    return value > 0 ? `+${formattedValue}%` : `${formattedValue}%`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          URL Performance Trends
        </h2>
        <div className="flex space-x-2">
          {/* Time period selector buttons */}
          {["7", "14", "30", "90"].map((period) => (
            <button
              key={period}
              className={`px-2 py-1 text-xs rounded ${
                timePeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() =>
                handleTimePeriodChange(period as "7" | "14" | "30" | "90")
              }
            >
              {period} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Clicks</p>
            <p className="text-xl font-semibold">
              {data.summary.total_clicks.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              <span
                className={
                  data.summary.comparison.total_clicks.change_percentage > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {formatChangePercentage(
                  data.summary.comparison.total_clicks.change_percentage
                )}
              </span>{" "}
              vs previous period
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Active URLs</p>
            <p className="text-xl font-semibold">
              {data.summary.total_urls.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              <span
                className={
                  data.summary.comparison.active_urls.change_percentage > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {formatChangePercentage(
                  data.summary.comparison.active_urls.change_percentage
                )}
              </span>{" "}
              vs previous period
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Avg. Clicks/URL</p>
            <p className="text-xl font-semibold">
              {data.summary.avg_clicks_per_url.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-gray-500">
              <span
                className={
                  data.summary.comparison.avg_clicks_per_url.change_percentage >
                  0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {formatChangePercentage(
                  data.summary.comparison.avg_clicks_per_url.change_percentage
                )}
              </span>{" "}
              vs previous period
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        <VisxLineChart
          data={timeSeriesData}
          height={250}
          isLoading={isLoading}
          lineColor="#3b82f6"
          className="mt-2"
        />
      </div>

      {/* Top performing days */}
      {data && data.top_performing_days.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-900 mb-2">
            Top Performing Days
          </h3>
          <div className="space-y-2">
            {data.top_performing_days.slice(0, 3).map((day, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {day.clicks.toLocaleString()} clicks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlPerformanceTrend;
