import React, { memo } from "react";
import DashboardHeader from "@/components/molecules/DashboardHeader";
import KpiCardsSection from "@/components/molecules/KpiCardsSection";
import UrlPerformanceTrend from "@/components/molecules/UrlPerformanceTrend";
import TopPerformingUrls from "@/components/molecules/TopPerformingUrls";
import CtrBreakdownChart from "@/components/molecules/CtrBreakdownChart";
import RecentActivity from "@/components/molecules/RecentActivity";
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
const AnalyticsDashboardTemplate: React.FC<AnalyticsDashboardTemplateProps> = ({
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
      <KpiCardsSection kpiData={dashboardData.kpiData} />

      {/* URL Performance Trend Chart */}
      <UrlPerformanceTrend performanceData={dashboardData.urlPerformance} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing URLs */}
        <TopPerformingUrls
          urls={dashboardData.urlPerformance.topPerformingUrls}
          isLoading={dashboardData.urlPerformance.isLoading}
          isError={dashboardData.urlPerformance.isError}
          onCopyUrl={onCopyUrl}
        />

        {/* CTR Breakdown */}
        <CtrBreakdownChart breakdownData={dashboardData.ctrBreakdown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity
          items={dashboardData.recentActivity.items}
          isLoading={dashboardData.recentActivity.isLoading}
          isError={dashboardData.recentActivity.isError}
        />
      </div>
    </div>
  );
};

// Export a memoized version of the component to prevent unnecessary re-renders
export default memo(AnalyticsDashboardTemplate);
