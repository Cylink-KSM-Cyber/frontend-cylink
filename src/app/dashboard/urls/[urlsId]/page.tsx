
"use client";

import React, { useEffect } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useUrlDetailDashboardAnalytics } from "@/hooks/useUrlDetailDashboardAnalytics";
import DetailAnalyticsDashboardTemplate from "@/components/templates/DetailAnalyticsDashboardTemplate";
import { Url } from "@/interfaces/url";
import { formatShortUrl } from "@/utils/urlFormatter";
import { useParams } from 'next/navigation';
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
  const params = useParams();
  const urlId = typeof params.id === "string" ? parseInt(params.id, 10) : undefined;
  const dashboardData = useUrlDetailDashboardAnalytics(urlId);

  // Handle URL copy
  const handleCopyUrl = (url: Url) => {
    const fullUrl = formatShortUrl(url.short_url);
    navigator.clipboard.writeText(fullUrl);
    showToast(`URL "${url.short_url}" copied to clipboard`, "success", 2000);
  };

  return (
    <DetailAnalyticsDashboardTemplate
      dashboardData={dashboardData}
      onCopyUrl={handleCopyUrl}
    />
  );
}
