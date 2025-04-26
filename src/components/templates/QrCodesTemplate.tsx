"use client";

import React from "react";
import { QrCode } from "@/interfaces/url";
import { QrCodeFilter } from "@/interfaces/qrcode";
import QrCodeGrid from "@/components/molecules/QrCodeGrid";
import QrCodeList from "@/components/organisms/QrCodeList";
import Pagination from "@/components/molecules/Pagination";
import Button from "@/components/atoms/Button";
import SearchInput from "@/components/atoms/SearchInput";
import QrCodeFilterControls from "@/components/organisms/QrCodeFilterControls";
import {
  RiQrCodeLine,
  RiAddLine,
  RiGridFill,
  RiListCheck,
} from "react-icons/ri";

/**
 * Props for QrCodesTemplate component
 */
interface QrCodesTemplateProps {
  /**
   * Array of QR codes to display
   */
  qrCodes: QrCode[];
  /**
   * Whether QR codes are loading
   */
  isLoading?: boolean;
  /**
   * Pagination information
   */
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  /**
   * Current view mode (grid or list)
   */
  viewMode: "grid" | "list";
  /**
   * Function to call when view mode changes
   */
  onViewModeChange: (mode: "grid" | "list") => void;
  /**
   * Function to call when page changes
   */
  onPageChange: (page: number) => void;
  /**
   * Function to call when filter changes
   */
  onFilterChange: (filter: Partial<QrCodeFilter>) => void;
  /**
   * Function to call when sort changes
   */
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  /**
   * Function to call when search term changes
   */
  onSearch: (term: string) => void;
  /**
   * Current search term
   */
  searchTerm: string;
  /**
   * Function to call when create QR code button is clicked
   */
  onCreateQrCode: () => void;
  /**
   * Function to call when QR code is clicked for preview
   */
  onPreviewQrCode: (qrCode: QrCode) => void;
  /**
   * Function to call when edit button is clicked
   */
  onEditQrCode: (qrCode: QrCode) => void;
  /**
   * Function to call when delete button is clicked
   */
  onDeleteQrCode: (qrCode: QrCode) => void;
  /**
   * Array of selected QR codes
   */
  selectedQrCodes: QrCode[];
  /**
   * Function to call when QR code selection changes
   */
  onSelectQrCode: (qrCode: QrCode, selected: boolean) => void;
  /**
   * Function to call when all QR codes are selected/deselected
   */
  onSelectAllQrCodes: (selected: boolean) => void;
  /**
   * Function to call when bulk delete is requested
   */
  onBulkDeleteQrCodes: () => void;
  /**
   * Function to call when download is requested
   */
  onDownloadQrCode: (qrCode: QrCode, format: "png" | "svg") => void;
}

/**
 * QrCodesTemplate Component
 * @description Displays QR codes management interface with filtering, sorting, and viewing options
 */
const QrCodesTemplate: React.FC<QrCodesTemplateProps> = ({
  qrCodes,
  isLoading = false,
  pagination,
  viewMode,
  onViewModeChange,
  onPageChange,
  onFilterChange,
  onSortChange,
  onSearch,
  searchTerm,
  onCreateQrCode,
  onPreviewQrCode,
  onEditQrCode,
  onDeleteQrCode,
  selectedQrCodes,
  onSelectQrCode,
  onSelectAllQrCodes,
  onBulkDeleteQrCodes,
  onDownloadQrCode,
}) => {
  // Calculate if any QR codes are selected
  const hasSelection = selectedQrCodes.length > 0;

  // Calculate if all QR codes on the current page are selected
  const allSelected =
    qrCodes.length > 0 && selectedQrCodes.length === qrCodes.length;

  // Helper to toggle all QR codes selection
  const toggleSelectAll = () => {
    onSelectAllQrCodes(!allSelected);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <RiQrCodeLine className="text-primary-600 text-2xl mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">
            QR Codes
            {!isLoading && (
              <span className="ml-2 text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                {pagination.total}
              </span>
            )}
          </h1>
        </div>
        <Button
          onClick={onCreateQrCode}
          variant="primary"
          startIcon={<RiAddLine />}
          className="whitespace-nowrap"
        >
          Create QR Code
        </Button>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-grow">
            <SearchInput
              placeholder="Search QR codes by URL or title..."
              initialValue={searchTerm}
              onSearch={onSearch}
              className="w-full"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`flex items-center px-3 py-2 ${
                  viewMode === "grid"
                    ? "bg-primary-50 text-primary-600"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                aria-label="Grid View"
              >
                <RiGridFill className="text-lg" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`flex items-center px-3 py-2 ${
                  viewMode === "list"
                    ? "bg-primary-50 text-primary-600"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
                aria-label="List View"
              >
                <RiListCheck className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <QrCodeFilterControls
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          className="mt-4"
        />

        {/* Bulk Actions */}
        {hasSelection && (
          <div className="flex items-center mt-4 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                {selectedQrCodes.length} selected
              </span>
            </div>
            <div className="ml-4 flex space-x-2">
              <Button onClick={onBulkDeleteQrCodes} variant="danger" size="sm">
                Delete Selected
              </Button>
              {/* Additional bulk actions can be added here */}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="mb-6">
        {viewMode === "grid" ? (
          <QrCodeGrid
            qrCodes={qrCodes}
            isLoading={isLoading}
            onEdit={onEditQrCode}
            onDelete={onDeleteQrCode}
            onPreview={onPreviewQrCode}
            selectedQrCodes={selectedQrCodes}
            onSelectQrCode={onSelectQrCode}
            className="grid-view"
          />
        ) : (
          <QrCodeList
            qrCodes={qrCodes}
            isLoading={isLoading}
            onEdit={onEditQrCode}
            onDelete={onDeleteQrCode}
            onPreview={onPreviewQrCode}
            selectedQrCodes={selectedQrCodes}
            onSelectQrCode={onSelectQrCode}
            onDownload={onDownloadQrCode}
            className="list-view"
          />
        )}

        {/* Empty State */}
        {!isLoading && qrCodes.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="py-6">
              <RiQrCodeLine className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No QR Codes Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "No QR codes match your search criteria."
                  : "You haven't generated any QR codes yet."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={onCreateQrCode}
                  variant="primary"
                  startIcon={<RiAddLine />}
                >
                  Create Your First QR Code
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && qrCodes.length > 0 && pagination.total_pages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default QrCodesTemplate;
