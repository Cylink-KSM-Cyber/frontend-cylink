"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardHeader from "@/components/organisms/DashboardHeader";
import DashboardTabs, { TabPanel } from "@/components/organisms/DashboardTabs";
import StatsSummary from "@/components/molecules/StatsSummary";
import UrlsTable from "@/components/molecules/UrlsTable";
import QrCodeGrid from "@/components/molecules/QrCodeGrid";
import Pagination from "@/components/molecules/Pagination";
import { RiLinkM, RiQrCodeLine, RiLineChartLine } from "react-icons/ri";
import { Url, QrCode, DashboardStats } from "@/interfaces/url";
import { useSidebar } from "@/contexts/SidebarContext";

/**
 * Prop types for DashboardTemplate component
 */
interface DashboardTemplateProps {
  /**
   * User's display name
   */
  userName?: string;
  /**
   * Dashboard stats data
   */
  stats: DashboardStats;
  /**
   * Array of URLs for the table
   */
  urls: Url[];
  /**
   * Whether URLs data is loading
   */
  isUrlsLoading?: boolean;
  /**
   * Whether stats data is loading
   */
  isStatsLoading?: boolean;
  /**
   * Current page for URL pagination
   */
  currentUrlPage: number;
  /**
   * Total number of URL pages
   */
  totalUrlPages: number;
  /**
   * Function to call when URL page changes
   */
  onUrlPageChange: (page: number) => void;
  /**
   * Function to call when URL sort changes
   */
  onUrlSortChange: (column: string, direction: "asc" | "desc") => void;
  /**
   * Current sort column for URLs
   */
  urlSortBy: string;
  /**
   * Current sort direction for URLs
   */
  urlSortDirection: "asc" | "desc";
  /**
   * Array of QR codes
   */
  qrCodes: QrCode[];
  /**
   * Whether QR code data is loading
   */
  isQrCodesLoading?: boolean;
  /**
   * Function to call when search input changes
   */
  onSearch: (value: string) => void;
  /**
   * Function to call when create URL button is clicked
   */
  onCreateUrl: () => void;
  /**
   * Function to call when URL copy button is clicked
   */
  onCopyUrl: (url: Url) => void;
  /**
   * Function to call when URL QR generate button is clicked
   */
  onGenerateQr: (url: Url) => void;
  /**
   * Function to call when URL edit button is clicked
   */
  onEditUrl: (url: Url) => void;
  /**
   * Function to call when URL delete button is clicked
   */
  onDeleteUrl: (url: Url) => void;
  /**
   * Function to call when QR code download button is clicked
   */
  onDownloadQr: (qrCode: QrCode) => void;
  /**
   * Function to call when QR code edit button is clicked
   */
  onEditQr: (qrCode: QrCode) => void;
  /**
   * Function to call when QR code delete button is clicked
   */
  onDeleteQr: (qrCode: QrCode) => void;
  /**
   * Function to call when QR code is clicked for preview
   */
  onQrPreview: (qrCode: QrCode) => void;
}

/**
 * DashboardTemplate Component
 * @description Main template for the dashboard page with tabs for URLs, QR codes, and analytics
 */
const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  userName,
  stats,
  urls,
  isUrlsLoading = false,
  isStatsLoading = false,
  currentUrlPage,
  totalUrlPages,
  onUrlPageChange,
  onUrlSortChange,
  urlSortBy,
  urlSortDirection,
  qrCodes,
  isQrCodesLoading = false,
  onSearch,
  onCreateUrl,
  onCopyUrl,
  onGenerateQr,
  onEditUrl,
  onDeleteUrl,
  onDownloadQr,
  onEditQr,
  onDeleteQr,
  onQrPreview,
}) => {
  // Get query params and router for updating URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  // Get sidebar context
  const { activeItemId } = useSidebar();

  // State for active tab
  const [activeTab, setActiveTab] = useState(tabParam ?? "urls");

  // Tab definitions
  const tabs = [
    { id: "urls", label: "My URLs", icon: <RiLinkM /> },
    { id: "qrcodes", label: "QR Codes", icon: <RiQrCodeLine /> },
    { id: "analytics", label: "Analytics", icon: <RiLineChartLine /> },
  ];

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Update URL query parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/dashboard?${params.toString()}`);
  };

  // Sync with sidebar active item
  useEffect(() => {
    if (
      activeItemId === "urls" ||
      activeItemId === "qrcodes" ||
      activeItemId === "analytics"
    ) {
      setActiveTab(activeItemId);
    }
  }, [activeItemId]);

  // Sync with URL query parameter
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Header Section */}
        <DashboardHeader
          userName={userName}
          onSearch={activeTab === "urls" ? onSearch : undefined}
          onCreateClick={onCreateUrl}
          className="mb-6"
        />

        {/* Stats Summary */}
        <StatsSummary
          stats={stats}
          isLoading={isStatsLoading}
          className="mb-6"
        />

        {/* Tabs */}
        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="mb-6"
        />

        {/* Tab Content */}
        <div className="mb-8">
          {/* URLs Tab */}
          <TabPanel id="urls" activeTab={activeTab}>
            <UrlsTable
              urls={urls}
              isLoading={isUrlsLoading}
              sortBy={urlSortBy}
              sortDirection={urlSortDirection}
              onSortChange={onUrlSortChange}
              onCopy={onCopyUrl}
              onGenerateQr={onGenerateQr}
              onEdit={onEditUrl}
              onDelete={onDeleteUrl}
              className="mb-6"
            />

            <Pagination
              currentPage={currentUrlPage}
              totalPages={totalUrlPages}
              onPageChange={onUrlPageChange}
              className="mt-6"
            />
          </TabPanel>

          {/* QR Codes Tab */}
          <TabPanel id="qrcodes" activeTab={activeTab}>
            <QrCodeGrid
              qrCodes={qrCodes}
              isLoading={isQrCodesLoading}
              onDownload={onDownloadQr}
              onEdit={onEditQr}
              onDelete={onDeleteQr}
              onPreview={onQrPreview}
            />
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel id="analytics" activeTab={activeTab}>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Analytics</h2>
              <p className="text-[#607D8B]">
                Detailed analytics will be implemented in the next phase.
              </p>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
