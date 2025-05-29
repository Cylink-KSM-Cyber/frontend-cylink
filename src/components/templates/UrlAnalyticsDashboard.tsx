"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiMousePointer,
  FiUsers,
  FiTrendingUp,
  FiRefreshCw,
  FiExternalLink,
  FiCalendar,
} from "react-icons/fi";

import { useAdvancedUrlAnalytics } from "@/hooks/useAdvancedUrlAnalytics";
import MetricCard from "@/components/atoms/MetricCard";
import ResponsiveTimeSeriesChart from "@/components/molecules/TimeSeriesChart";
import ResponsiveBarChart, {
  BarChartData,
} from "@/components/molecules/BarChart";
import DateRangePicker from "@/components/molecules/DateRangePicker";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";

interface UrlAnalyticsDashboardProps {
  urlId: number;
}

/**
 * URL Analytics Dashboard Template
 * @description Main dashboard component for displaying comprehensive URL analytics
 * @param urlId - The ID of the URL to display analytics for
 * @returns React component
 */
export const UrlAnalyticsDashboard: React.FC<UrlAnalyticsDashboardProps> = ({
  urlId,
}) => {
  const {
    analyticsData,
    isLoading,
    error,
    refetch,
    updateParams,
    currentParams,
  } = useAdvancedUrlAnalytics({
    urlId,
    autoFetch: true,
    group_by: "day",
    comparison: "30",
  });

  /**
   * Transform browser stats to chart data
   */
  const browserChartData: BarChartData[] = useMemo(() => {
    if (!analyticsData?.browser_stats) return [];
    return Object.entries(analyticsData.browser_stats).map(
      ([browser, count]) => ({
        label: browser,
        value: count,
      })
    );
  }, [analyticsData?.browser_stats]);

  /**
   * Transform device stats to chart data
   */
  const deviceChartData: BarChartData[] = useMemo(() => {
    if (!analyticsData?.device_stats) return [];
    return Object.entries(analyticsData.device_stats).map(
      ([device, count]) => ({
        label: device,
        value: count,
      })
    );
  }, [analyticsData?.device_stats]);

  /**
   * Transform country stats to chart data
   */
  const countryChartData: BarChartData[] = useMemo(() => {
    if (!analyticsData?.country_stats) return [];
    return Object.entries(analyticsData.country_stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10 countries
      .map(([country, count]) => ({
        label: country,
        value: count,
      }));
  }, [analyticsData?.country_stats]);

  /**
   * Handle date range changes
   */
  const handleDateChange = (startDate: string, endDate: string) => {
    updateParams({ start_date: startDate, end_date: endDate });
  };

  /**
   * Handle comparison period changes
   */
  const handleComparisonChange = (
    comparison: "7" | "14" | "30" | "90" | "custom"
  ) => {
    updateParams({ comparison });
  };

  /**
   * Handle custom comparison changes
   */
  const handleCustomComparisonChange = (start: string, end: string) => {
    updateParams({
      custom_comparison_start: start,
      custom_comparison_end: end,
    });
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Analytics
            </h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <FiExternalLink className="w-4 h-4" />
                  <span className="text-sm">URL ID: {urlId}</span>
                </div>
                {analyticsData?.short_code && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      Short Code: {analyticsData.short_code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiRefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <DateRangePicker
              startDate={currentParams.start_date}
              endDate={currentParams.end_date}
              comparison={currentParams.comparison}
              onDateChange={handleDateChange}
              onComparisonChange={handleComparisonChange}
              customComparisonStart={currentParams.custom_comparison_start}
              customComparisonEnd={currentParams.custom_comparison_end}
              onCustomComparisonChange={handleCustomComparisonChange}
              className="w-full sm:w-auto"
            />
          </div>
        </motion.div>

        {isLoading && !analyticsData ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {/* Overview Metrics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <MetricCard
                title="Total Clicks"
                value={analyticsData?.total_clicks ?? 0}
                previousValue={
                  analyticsData?.historical_analysis?.summary?.comparison
                    ?.total_clicks?.previous
                }
                changePercentage={
                  analyticsData?.historical_analysis?.summary?.comparison
                    ?.total_clicks?.change_percentage
                }
                icon={<FiMousePointer />}
                loading={isLoading}
              />

              <MetricCard
                title="Unique Visitors"
                value={analyticsData?.unique_visitors ?? 0}
                icon={<FiUsers />}
                loading={isLoading}
              />

              <MetricCard
                title="CTR"
                value={analyticsData?.ctr_statistics?.overall?.ctr ?? 0}
                previousValue={
                  analyticsData?.ctr_statistics?.comparison?.metrics?.ctr
                    ?.previous
                }
                changePercentage={
                  analyticsData?.ctr_statistics?.comparison?.metrics?.ctr
                    ?.change_percentage
                }
                icon={<FiTrendingUp />}
                format="percentage"
                loading={isLoading}
              />

              <MetricCard
                title="Impressions"
                value={
                  analyticsData?.ctr_statistics?.overall?.total_impressions ?? 0
                }
                previousValue={
                  analyticsData?.ctr_statistics?.comparison?.metrics
                    ?.impressions?.previous
                }
                changePercentage={
                  analyticsData?.ctr_statistics?.comparison?.metrics
                    ?.impressions?.change_percentage
                }
                icon={<FiCalendar />}
                loading={isLoading}
              />
            </motion.div>

            {/* Charts Section */}
            <div className="space-y-8">
              {/* Time Series Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Clicks Over Time
                </h2>
                <ResponsiveTimeSeriesChart
                  data={analyticsData?.time_series_data || []}
                />
              </motion.div>

              {/* Distribution Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Browser Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <ResponsiveBarChart
                    data={browserChartData}
                    title="Browser Distribution"
                    height={300}
                  />
                </motion.div>

                {/* Device Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <ResponsiveBarChart
                    data={deviceChartData}
                    title="Device Distribution"
                    height={300}
                  />
                </motion.div>
              </div>

              {/* Geographic Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <ResponsiveBarChart
                  data={countryChartData}
                  title="Top Countries"
                  height={400}
                />
              </motion.div>

              {/* Top Referrers Table */}
              {analyticsData?.top_referrers &&
                analyticsData.top_referrers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-white rounded-lg border border-gray-200 p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Top Referrers
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">
                              Referrer
                            </th>
                            <th className="text-right py-3 px-4 font-medium text-gray-700">
                              Clicks
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.top_referrers.map((referrer) => (
                            <tr
                              key={referrer.referrer}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 text-gray-900">
                                {referrer.referrer}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-700 font-medium">
                                {referrer.count.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
