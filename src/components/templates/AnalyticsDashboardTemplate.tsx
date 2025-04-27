import React, { useState } from "react";
import DashboardHeader from "@/components/molecules/DashboardHeader";
import KpiCardsSection from "@/components/molecules/KpiCardsSection";
import UrlPerformanceTrend from "@/components/molecules/UrlPerformanceTrend";
import TopPerformingUrls from "@/components/molecules/TopPerformingUrls";
import CtrBreakdownChart from "@/components/molecules/CtrBreakdownChart";
import RecentActivity from "@/components/molecules/RecentActivity";
import { DashboardAnalyticsData, TimePeriod } from "@/interfaces/dashboard";
import { Url } from "@/interfaces/url";

interface AnalyticsDashboardTemplateProps {
  dashboardData: DashboardAnalyticsData;
  onCopyUrl?: (url: Url) => void;
  className?: string;
}

/**
 * AnalyticsDashboardTemplate
 * Main layout template for the analytics dashboard
 */
const AnalyticsDashboardTemplate: React.FC<AnalyticsDashboardTemplateProps> = ({
  dashboardData,
  onCopyUrl,
  className = "",
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    dashboardData.setTimePeriod(period);
  };

  // Handle dashboard refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await dashboardData.refresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-8 ${className}`}>
      {/* Dashboard Header */}
      <DashboardHeader
        timePeriod={dashboardData.timePeriod}
        onTimePeriodChange={handleTimePeriodChange}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        className="mb-8"
      />

      {/* KPI Cards */}
      <KpiCardsSection kpiData={dashboardData.kpiData} className="mb-8" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* URL Performance Trend (spans 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <UrlPerformanceTrend performanceData={dashboardData.urlPerformance} />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity
            items={dashboardData.recentActivity.items}
            isLoading={dashboardData.recentActivity.isLoading}
            isError={dashboardData.recentActivity.isError}
          />
        </div>
      </div>

      {/* Bottom Content Grid */}
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
    </div>
  );
};

export default AnalyticsDashboardTemplate;
