import React, { memo } from "react";
import DashboardHeader from "@/components/molecules/DashboardHeader";
import DetailKpiCardsSection from "@/components/molecules/DetailKpiCardsSection";
import UrlPerformanceTrend from "@/components/molecules/UrlPerformanceTrend";
import TopPerformingUrls from "@/components/molecules/TopPerformingUrls";
import { DashboardAnalyticsData } from "@/interfaces/dashboard";
import { Url } from "@/interfaces/url";

interface AnalyticsDashboardTemplateProps {
  dashboardData: DashboardAnalyticsData;
  onCopyUrl?: (url: Url) => void;
  className?: string;
}

/**
 * Analytics Dashboard Template
 * Organizes and displays all dashboard sections and components
 *
 * @param dashboardData - All dashboard data from useDashboardAnalytics hook
 * @param onCopyUrl - Handler for copying URL to clipboard
 * @param className - Optional CSS class
 * @returns React component
 */
const DetailAnalyticsDashboardTemplate: React.FC<AnalyticsDashboardTemplateProps> = ({
  dashboardData,
  onCopyUrl,
  className = "",
}) => {
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
