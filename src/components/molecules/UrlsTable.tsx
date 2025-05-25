import React, { useState } from "react";
import { Url } from "@/interfaces/url";
import StatusBadge from "@/components/atoms/StatusBadge";
import ButtonIcon from "@/components/atoms/ButtonIcon";
import Button from "@/components/atoms/Button";
import { formatShortUrl } from "@/utils/urlFormatter";

// Icon imports
import {
  RiFileCopyLine,
  RiQrCodeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiLink,
} from "react-icons/ri";

/**
 * Prop types for UrlsTable component
 */
interface UrlsTableProps {
  /**
   * Array of URL data to display
   */
  urls: Url[];
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
  /**
   * Current sorting column
   */
  sortBy?: string;
  /**
   * Current sorting direction
   */
  sortDirection?: "asc" | "desc";
  /**
   * Function to call when sort changes
   */
  onSortChange?: (column: string, direction: "asc" | "desc") => void;
  /**
   * Function to call when copy button is clicked
   */
  onCopy?: (url: Url) => void;
  /**
   * Function to call when QR code button is clicked
   */
  onGenerateQr?: (url: Url) => void;
  /**
   * Function to call when edit button is clicked
   */
  onEdit?: (url: Url) => void;
  /**
   * Function to call when delete button is clicked
   */
  onDelete?: (url: Url) => void;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * UrlsTable Component
 * @description Displays URL data in a sortable and interactive table
 */
const UrlsTable: React.FC<UrlsTableProps> = ({
  urls,
  isLoading = false,
  sortBy = "created_at",
  sortDirection = "desc",
  onSortChange,
  onCopy,
  onGenerateQr,
  onEdit,
  onDelete,
  className = "",
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Handle sort click
  const handleSortClick = (column: string) => {
    if (!onSortChange) return;

    const newDirection =
      sortBy === column && sortDirection === "desc" ? "asc" : "desc";
    onSortChange(column, newDirection);
  };

  // Handle copy click with temporary visual feedback
  const handleCopyClick = (url: Url) => {
    if (!onCopy) return;

    onCopy(url);
    setCopiedId(url.id);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Generate the sort indicator for column headers
  const getSortIndicator = (column: string) => {
    if (column !== sortBy) return null;

    return sortDirection === "asc" ? (
      <RiArrowUpSLine className="inline ml-1" />
    ) : (
      <RiArrowDownSLine className="inline ml-1" />
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Truncate long URLs
  const truncateUrl = (url: string, maxLength = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  // If loading, show skeleton table
  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-14 bg-gray-100 border-b"></div>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-16 border-b flex items-center px-4">
              <div className="w-full flex justify-between">
                <div className="w-2/3">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-1">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no URLs and not loading, show empty state
  if (!isLoading && urls.length === 0) {
    console.log(
      "UrlsTable: Rendering empty state - urls array is empty and not loading"
    );
    return (
      <div
        className={`bg-white rounded-lg shadow-sm p-8 text-center ${className}`}
      >
        <div className="py-6">
          <RiLink className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No URLs Found
          </h3>
          <p className="text-gray-500 mb-4">
            You haven&apos;t created any shortened URLs yet.
          </p>
          <Button
            variant="primary"
            startIcon={<RiLink />}
            onClick={() => {
              /* Navigation or modal trigger would go here */
            }}
          >
            Create Your First URL
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F5F5F5]">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("original_url")}
              >
                Original URL {getSortIndicator("original_url")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("short_url")}
              >
                Short URL {getSortIndicator("short_url")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("created_at")}
              >
                Created {getSortIndicator("created_at")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("expiry_date")}
              >
                Expired {getSortIndicator("expiry_date")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("clicks")}
              >
                Clicks {getSortIndicator("clicks")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortClick("is_active")}
              >
                Status {getSortIndicator("is_active")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-[#333333] uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {urls.map((url) => (
              <tr key={url.id} className="hover:bg-[#F5F5F5] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#333333]">
                    {truncateUrl(url.original_url)}
                  </div>
                  {url.title && (
                    <div className="text-xs text-[#607D8B]">{url.title}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <a
                      href={formatShortUrl(url.short_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-black hover:text-[#607D8B] transition-colors flex items-center"
                    >
                      {url.short_url} <RiExternalLinkLine className="ml-1" />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#333333]">
                    {formatDate(url.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#333333]">
                    {formatDate(url.expiry_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-[#333333]">
                      {url.clicks.toLocaleString()}
                    </div>
                    {url.clickTrend !== undefined && (
                      <div
                        className={`ml-2 text-xs ${
                          url.clickTrend > 0
                            ? "text-[#009688]"
                            : url.clickTrend < 0
                            ? "text-[#D32F2F]"
                            : "text-[#607D8B]"
                        }`}
                      >
                        {url.clickTrend > 0
                          ? "↑"
                          : url.clickTrend < 0
                          ? "↓"
                          : "→"}{" "}
                        {Math.abs(url.clickTrend).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={url.is_active ? "active" : "inactive"} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-1">
                    <ButtonIcon
                      icon={copiedId === url.id ? "✓" : <RiFileCopyLine />}
                      onClick={() => handleCopyClick(url)}
                      tooltip="Copy URL"
                      ariaLabel="Copy shortened URL"
                      variant={copiedId === url.id ? "success" : "default"}
                    />
                    <ButtonIcon
                      icon={<RiQrCodeLine />}
                      onClick={() => onGenerateQr?.(url)}
                      tooltip="Generate QR"
                      ariaLabel="Generate QR code"
                    />
                    <ButtonIcon
                      icon={<RiEditLine />}
                      onClick={() => onEdit?.(url)}
                      tooltip="Edit"
                      ariaLabel="Edit URL"
                    />
                    <ButtonIcon
                      icon={<RiDeleteBinLine />}
                      onClick={() => onDelete?.(url)}
                      tooltip="Delete"
                      ariaLabel="Delete URL"
                      variant="danger"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlsTable;
