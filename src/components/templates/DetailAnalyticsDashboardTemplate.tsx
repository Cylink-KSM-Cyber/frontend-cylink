import React, { memo } from "react";
import DashboardHeader from "@/components/molecules/DashboardHeader";
import DetailKpiCardsSection from "@/components/molecules/DetailKpiCardsSection";
import UrlPerformanceTrend from "@/components/molecules/UrlPerformanceTrend";
import { DashboardAnalyticsData } from "@/interfaces/dashboard";

interface AnalyticsDashboardTemplateProps {
  dashboardData: DashboardAnalyticsData;
  className?: string;
  isLoading?: boolean;
}

/**
 * Analytics Dashboard Template
 * Organizes and displays all dashboard sections and components
 *
 * @param dashboardData - All dashboard data from useDashboardAnalytics hook
 * @param className - Optional CSS class
 * @param isLoading - Whether the data is loading
 * @returns React component
 */
const DetailAnalyticsDashboardTemplate: React.FC<
  AnalyticsDashboardTemplateProps
> = ({ dashboardData, className = "", isLoading = false }) => {
  // Display loading state if data is loading
  if (isLoading) {
    return (
      <div className={`space-y-6 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-32">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 h-64">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-4 ${className}`}>
      {/* Dashboard header with time period selector */}
      <DashboardHeader
        title="Analytics Dashboard"
        timePeriod={dashboardData.timePeriod}
        onTimePeriodChange={dashboardData.setTimePeriod}
        onRefresh={dashboardData.refresh}
      />

      {/* KPI Cards Section */}
      <DetailKpiCardsSection kpiData={dashboardData.kpiData} />

      {/* URL Performance Trend Chart */}
      <UrlPerformanceTrend />
    </div>
  );
};

// Export a memoized version of the component to prevent unnecessary re-renders
export default memo(DetailAnalyticsDashboardTemplate);
