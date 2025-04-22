"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useUrls } from "@/hooks/useUrls";
import { useQrCodes } from "@/hooks/useQrCodes";
import { useDeleteUrl } from "@/hooks/useDeleteUrl";
import { Url, QrCode } from "@/interfaces/url";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useToast } from "@/contexts/ToastContext";
import DeleteUrlModal from "@/components/molecules/DeleteUrlModal";
import QrCodeModal from "@/components/molecules/QrCodeModal";
import "@/styles/dashboard.css";
import "@/styles/statsSummary.css";
import "@/styles/totalClicks.css";
import "@/styles/conversionStats.css";

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

  // Get toast context for notifications
  const { showToast } = useToast();

  // Get tab from URL query params
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // Initialize search state
  const [searchQuery, setSearchQuery] = useState("");

  // Delete URL modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<Url | null>(null);

  // QR Code modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [urlForQrCode, setUrlForQrCode] = useState<Url | null>(null);

  // Initialize URL sort state
  const [urlSort, setUrlSort] = useState({
    sortBy: "created_at" as "created_at" | "clicks" | "title",
    sortOrder: "desc" as "asc" | "desc",
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
    refreshUrls,
  } = useUrls({
    page: 1,
    limit: 10,
    search: searchQuery,
    sortBy: urlSort.sortBy,
    sortOrder: urlSort.sortOrder,
  });

  // URL deletion hook
  const { deleteUrl, isDeleting, error: deleteError } = useDeleteUrl();

  // Fetch QR code data
  const {
    qrCodes,
    isLoading: isQrCodesLoading,
    error: qrCodesError,
    deleteQrCode,
  } = useQrCodes({
    page: 1,
    limit: 10,
    sortBy: "created_at",
    sortOrder: "desc",
  });

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
    const sortBy = column as "created_at" | "clicks" | "title";
    setUrlSort({ sortBy, sortOrder: direction });
    updateFilter({ sortBy, sortOrder: direction });
  };

  // Handle URL copy
  const handleCopyUrl = (url: Url) => {
    navigator.clipboard.writeText(`https://${url.short_url}`);
    showToast(`URL "${url.short_url}" copied to clipboard`, "success", 2000);
  };

  // Handle URL edit
  const handleEditUrl = (url: Url) => {
    // This would typically open a modal or navigate to an edit page
    console.log("Edit URL:", url.id);
  };

  // Open delete confirmation modal
  const handleDeleteUrl = (url: Url) => {
    setUrlToDelete(url);
    setDeleteModalOpen(true);
  };

  // Confirm URL deletion
  const confirmDeleteUrl = async (url: Url) => {
    const success = await deleteUrl(url.id);

    if (success) {
      // Close modal
      setDeleteModalOpen(false);
      setUrlToDelete(null);

      // Wait 1.3 seconds as requested before refreshing
      setTimeout(() => {
        refreshUrls();
      }, 1300);
    }
  };

  // Cancel URL deletion
  const cancelDeleteUrl = () => {
    setDeleteModalOpen(false);
    setUrlToDelete(null);
  };

  // Handle QR code generation
  const handleGenerateQr = (url: Url) => {
    setUrlForQrCode(url);
    setQrModalOpen(true);
  };

  // Close QR code modal
  const handleCloseQrModal = () => {
    setQrModalOpen(false);
    // Wait for modal close animation to finish
    setTimeout(() => {
      setUrlForQrCode(null);
    }, 300);
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
    deleteQrCode(String(qrCode.id));
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
  if (deleteError) console.error("Delete error:", deleteError);

  // Default stats if none are available
  const dashboardStats = stats || {
    totalUrls: 0,
    totalClicks: 0,
    conversionRate: 0,
    qrCodesGenerated: 0,
    activeUrls: 0,
    urlsCreatedToday: 0,
    averageClicksPerUrl: 0,
    totalClicksData: undefined,
  };

  return (
    <>
      <DashboardTemplate
        userName={user?.username ?? "User"}
        stats={dashboardStats}
        urls={urls ?? []}
        isUrlsLoading={isUrlsLoading}
        isStatsLoading={isStatsLoading}
        currentUrlPage={pagination?.page ?? 1}
        totalUrlPages={pagination?.total_pages ?? 1}
        onUrlPageChange={handleUrlPageChange}
        onUrlSortChange={handleUrlSortChange}
        urlSortBy={urlSort.sortBy}
        urlSortDirection={urlSort.sortOrder}
        qrCodes={qrCodes || []}
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

      {/* Delete URL Modal */}
      <DeleteUrlModal
        url={urlToDelete}
        isOpen={deleteModalOpen}
        onConfirm={confirmDeleteUrl}
        onCancel={cancelDeleteUrl}
        isDeleting={isDeleting}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        url={urlForQrCode}
        isOpen={qrModalOpen}
        onClose={handleCloseQrModal}
      />
    </>
  );
}
