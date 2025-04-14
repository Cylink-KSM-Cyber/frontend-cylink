"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useUrls } from "@/hooks/useUrls";
import { useQrCodes } from "@/hooks/useQrCodes";
import { Url, QrCode } from "@/interfaces/url";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import UserStatsCard from "@/components/molecules/UserStatsCard";
import "@/styles/dashboard.css";

/**
 * Dashboard page
 * @description The user dashboard page with URL management and analytics
 * @returns Dashboard page component
 */
export default function DashboardPage() {
  // Get user from auth context
  const { user } = useAuth();

  // Get sidebar context to sync with tab changes
  const { setActiveItemId } = useSidebar();

  // Get tab from URL query params
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Initialize search state
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize URL sort state
  const [urlSort, setUrlSort] = useState({
    sortBy: "createdAt" as "createdAt" | "clicks" | "lastClicked",
    sortDirection: "desc" as "asc" | "desc",
  });

  // Fetch dashboard stats data
  const {
    stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useDashboardStats();

  // Fetch URL data with filter
  const {
    urls,
    isLoading: isUrlsLoading,
    error: urlsError,
    pagination,
    updateFilter,
    deleteUrl,
  } = useUrls({
    page: 1,
    limit: 10,
    search: searchQuery,
    sortBy: urlSort.sortBy,
    sortDirection: urlSort.sortDirection,
  });

  // Fetch QR code data
  const {
    qrCodes,
    isLoading: isQrCodesLoading,
    error: qrCodesError,
    deleteQrCode,
    generateQrCode,
  } = useQrCodes();

  // Handle search query changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle URL page changes
  const handleUrlPageChange = (page: number) => {
    updateFilter({ page });
  };

  // Handle URL sort changes
  const handleUrlSortChange = (column: string, direction: "asc" | "desc") => {
    const sortBy = column as "createdAt" | "clicks" | "lastClicked";
    setUrlSort({ sortBy, sortDirection: direction });
    updateFilter({ sortBy, sortDirection: direction });
  };

  // Handle URL copy
  const handleCopyUrl = (url: Url) => {
    navigator.clipboard.writeText(`https://${url.shortUrl}`);
  };

  // Handle URL edit
  const handleEditUrl = (url: Url) => {
    // This would typically open a modal or navigate to an edit page
    console.log("Edit URL:", url.id);
  };

  // Handle URL delete
  const handleDeleteUrl = (url: Url) => {
    // In a real app, this would show a confirmation dialog
    deleteUrl(url.id);
  };

  // Handle QR code generation
  const handleGenerateQr = (url: Url) => {
    // This would typically open a modal for QR code customization
    generateQrCode(url.id);
  };

  // Handle QR code download
  const handleDownloadQr = (qrCode: QrCode) => {
    // In a real app, this would trigger a download
    window.open(qrCode.imageUrl, "_blank");
  };

  // Handle QR code edit
  const handleEditQr = (qrCode: QrCode) => {
    // This would typically open a modal for QR code customization
    console.log("Edit QR code:", qrCode.id);
  };

  // Handle QR code delete
  const handleDeleteQr = (qrCode: QrCode) => {
    // In a real app, this would show a confirmation dialog
    deleteQrCode(qrCode.id);
  };

  // Handle QR code preview
  const handleQrPreview = (qrCode: QrCode) => {
    // This would typically open a modal with a larger preview
    window.open(qrCode.imageUrl, "_blank");
  };

  // Handle create new URL
  const handleCreateUrl = () => {
    // This would typically open a modal or navigate to a create page
    console.log("Create new URL");
  };

  // Set initial active tab based on URL params
  useEffect(() => {
    if (tabParam) {
      setActiveItemId(tabParam);
    } else {
      setActiveItemId("dashboard");
    }
  }, [tabParam, setActiveItemId]);

  // If there are errors, we could show error states
  // For now, we'll just log them and continue with available data
  if (statsError) console.error("Stats error:", statsError);
  if (urlsError) console.error("URLs error:", urlsError);
  if (qrCodesError) console.error("QR codes error:", qrCodesError);

  return (
    <div className="py-6">
      {/* User Stats Card */}
      <div className="mb-8">
        <UserStatsCard
          userName={user?.username || "User"}
          stats={
            stats || {
              totalUrls: 0,
              totalClicks: 0,
              conversionRate: 0,
              qrCodesGenerated: 0,
              activeUrls: 0,
              urlsCreatedToday: 0,
              averageClicksPerUrl: 0,
            }
          }
          isLoading={isStatsLoading}
          joinDate={user?.created_at}
        />
      </div>

      {/* Dashboard Template */}
      <DashboardTemplate
        userName={user?.username || "User"}
        stats={
          stats || {
            totalUrls: 0,
            totalClicks: 0,
            conversionRate: 0,
            qrCodesGenerated: 0,
            activeUrls: 0,
            urlsCreatedToday: 0,
            averageClicksPerUrl: 0,
          }
        }
        urls={urls}
        isUrlsLoading={isUrlsLoading}
        isStatsLoading={isStatsLoading}
        currentUrlPage={pagination.page}
        totalUrlPages={pagination.totalPages}
        onUrlPageChange={handleUrlPageChange}
        onUrlSortChange={handleUrlSortChange}
        urlSortBy={urlSort.sortBy}
        urlSortDirection={urlSort.sortDirection}
        qrCodes={qrCodes}
        isQrCodesLoading={isQrCodesLoading}
        onSearch={handleSearch}
        onCreateUrl={handleCreateUrl}
        onCopyUrl={handleCopyUrl}
        onGenerateQr={handleGenerateQr}
        onEditUrl={handleEditUrl}
        onDeleteUrl={handleDeleteUrl}
        onDownloadQr={handleDownloadQr}
        onEditQr={handleEditQr}
        onDeleteQr={handleDeleteQr}
        onQrPreview={handleQrPreview}
      />
    </div>
  );
}
