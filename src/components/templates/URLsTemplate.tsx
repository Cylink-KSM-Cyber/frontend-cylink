"use client";

import type { DashboardStats, Url } from "@/interfaces/url";
import type React from "react";
import UrlStatsSummary from "../molecules/UrlStatsSummary";
import UrlHeader from "../organisms/UrlHeader";
import UrlsTable from "../molecules/UrlsTable";
import SearchInput from "../atoms/SearchInput";
import { RiAddLine } from "react-icons/ri";
import Button from "../atoms/Button";
import Pagination from "../molecules/Pagination";
import UrlFilter from "../molecules/UrlFilter";

/**
 * Prop types for DashboardTemplate component
 */
interface UrlTemplateProps {
  /**
   * Url stats data
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
   * Current URL filters
   */
  urlFilters: {
    status?: string;
    limit?: number;
  };
  /**
   * Function to call when any URL filter changes
   */
  onUrlFilterChange: (filterType: string, value: string | number) => void;
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
}

/**
 * UrlTemplate Component
 * @description Main template for the Url page with tabs for URLs, QR codes, and analytics
 */
const UrlTemplate: React.FC<UrlTemplateProps> = ({
  stats,
  urls,
  isUrlsLoading = false,
  isStatsLoading = false,
  currentUrlPage,
  totalUrlPages,
  urlFilters,
  onUrlFilterChange,
  onUrlPageChange,
  onUrlSortChange,
  urlSortBy,
  urlSortDirection,
  onSearch,
  onCreateUrl,
  onCopyUrl,
  onGenerateQr,
  onEditUrl,
  onDeleteUrl,
}) => {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-2 sm:px-4 gap-6">
        {/* Header Section */}
        <UrlHeader className="mb-6" />

        {/* Stats Summary */}
        <UrlStatsSummary
          stats={stats}
          isLoading={isStatsLoading}
          className="mb-6"
        />

        <div className="flex flex-col gap-6 sm:flex-row lg:justify-between">
          {onSearch && (
            <div className="w-full lg:w-[50%] ">
              <SearchInput placeholder="Search URLs..." onSearch={onSearch} />
            </div>
          )}
          <div>
            <UrlFilter
              filters={urlFilters}
              onFilterChange={onUrlFilterChange}
            />
          </div>
          <Button
            variant="primary"
            onClick={() => onCreateUrl()}
            startIcon={<RiAddLine className="max-h-4 max-w-4 cursor-pointer" />}
          >
            Create New URL
          </Button>
        </div>
        <div className="mt-6">
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
        </div>

        <Pagination
          currentPage={currentUrlPage}
          totalPages={totalUrlPages}
          onPageChange={onUrlPageChange}
          className="mt-6"
        />
      </div>
    </div>
  );
};

export default UrlTemplate;
