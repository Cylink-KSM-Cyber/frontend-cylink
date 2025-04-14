import React, { useState } from "react";
import DashboardHeader from "@/components/organisms/DashboardHeader";
import DashboardTabs, { TabPanel } from "@/components/organisms/DashboardTabs";
import StatsSummary from "@/components/molecules/StatsSummary";
import UrlsTable from "@/components/molecules/UrlsTable";
import QrCodeGrid from "@/components/molecules/QrCodeGrid";
import Pagination from "@/components/molecules/Pagination";
import { RiLinkM, RiQrCodeLine, RiLineChartLine } from "react-icons/ri";
import { Url, QrCode, DashboardStats } from "../../interfaces/url";

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
  // State for active tab
  const [activeTab, setActiveTab] = useState("urls");

  // Tab definitions
  const tabs = [
    { id: "urls", label: "My URLs", icon: <RiLinkM /> },
    { id: "qrcodes", label: "QR Codes", icon: <RiQrCodeLine /> },
    { id: "analytics", label: "Analytics", icon: <RiLineChartLine /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <DashboardHeader
          userName={userName}
          onSearch={activeTab === "urls" ? onSearch : undefined}
          onCreateClick={onCreateUrl}
          className="mb-8"
        />

        {/* Stats Summary */}
        <StatsSummary
          stats={stats}
          isLoading={isStatsLoading}
          className="mb-8"
        />

        {/* Tabs */}
        <DashboardTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
