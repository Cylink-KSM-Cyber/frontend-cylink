"use client";

import React, { useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import AnalyticsDashboardTemplate from "@/components/templates/AnalyticsDashboardTemplate";
import { Url } from "@/interfaces/url";
import "@/styles/analyticsDashboard.css";

/**
 * Dashboard page
 * @description The user analytics dashboard page
 * @returns Dashboard page component
 */
export default function DashboardPage() {
  // Get sidebar context to set active item
  const { setActiveItemId } = useSidebar();

  // Get toast context for notifications
  const { showToast } = useToast();

  // Set the active sidebar item
  useEffect(() => {
    setActiveItemId("dashboard");
  }, [setActiveItemId]);

  // Get dashboard analytics data
  const dashboardData = useDashboardAnalytics();

  // Handle URL copy
  const handleCopyUrl = (url: Url) => {
    navigator.clipboard.writeText(`https://${url.short_url}`);
    showToast(`URL "${url.short_url}" copied to clipboard`, "success", 2000);
  };

  return (
    <AnalyticsDashboardTemplate
      dashboardData={dashboardData}
      onCopyUrl={handleCopyUrl}
    />
  );
}
