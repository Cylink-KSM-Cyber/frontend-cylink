"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUrlDetailDashboardAnalytics } from "@/hooks/useUrlDetailDashboardAnalytics";
import DetailAnalyticsDashboardTemplate from "@/components/templates/DetailAnalyticsDashboardTemplate";
import { useParams } from "next/navigation";
import LoadingIndicator from "@/components/atoms/LoadingIndicator";
import { useUrlAnalytics } from "@/hooks/useUrlAnalytics";
import "@/styles/analyticsDashboard.css";

/**
 * URL Detail Dashboard Page
 * @description Displays detailed analytics for a specific URL
 * @returns Dashboard page component with URL analytics
 */
export default function UrlDetailPage() {
  // Get sidebar context to set active item
  const { setActiveItemId } = useSidebar();

  // Get URL ID from params
  const params = useParams();
  const urlsId = params?.urlsId;
  const urlId = urlsId ? parseInt(urlsId.toString(), 10) : undefined;

  // Loading state for initial render
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Get analytics data with lazy loading
  const { isLoading, isLazyLoading, fetchAnalyticsData } = useUrlAnalytics({
    urlId,
    enableLazyLoading: true,
  });

  // Get dashboard analytics data
  const dashboardData = useUrlDetailDashboardAnalytics(urlId);

  // Set the active sidebar item
  useEffect(() => {
    setActiveItemId("dashboard");
  }, [setActiveItemId]);

  // Fetch analytics data when component mounts
  useEffect(() => {
    if (urlId) {
      // Fetch analytics data
      fetchAnalyticsData()
        .then(() => {
          setIsInitialLoading(false);
        })
        .catch(() => {
          setIsInitialLoading(false);
        });
    } else {
      setIsInitialLoading(false);
    }
  }, [urlId, fetchAnalyticsData]);

  // If loading, show loading indicator
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <LoadingIndicator size="lg" />
          <p className="mt-4 text-gray-600">Loading URL analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <DetailAnalyticsDashboardTemplate
      dashboardData={dashboardData}
      isLoading={isLoading || isLazyLoading}
    />
  );
}
