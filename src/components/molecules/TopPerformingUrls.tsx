import React from "react";
import { Url } from "@/interfaces/url";
import { RiExternalLinkLine, RiFileCopyLine } from "react-icons/ri";
import { formatShortUrl } from "@/utils/urlFormatter";

interface TopPerformingUrlsProps {
  urls: Url[];
  isLoading: boolean;
  isError: boolean;
  className?: string;
  onCopyUrl?: (url: Url) => void;
}

/**
 * TopPerformingUrls Component
 * Displays a list of top performing URLs with their metrics
 */
const TopPerformingUrls: React.FC<TopPerformingUrlsProps> = ({
  urls,
  isLoading,
  isError,
  className = "",
  onCopyUrl,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Top Performing URLs
        </h2>
        <div className="space-y-3 animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
            >
              <div className="flex-1">
                <div className="h-2.5 bg-gray-200 rounded-full w-24 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full w-32"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded-full w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Top Performing URLs
        </h2>
        <div className="flex items-center justify-center h-48 text-red-500">
          <p>Failed to load URL data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!urls || urls.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Top Performing URLs
        </h2>
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p>No URLs available yet.</p>
          <p className="text-sm mt-2">
            Create URLs to start tracking performance.
          </p>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle copy URL action
  const handleCopy = (url: Url) => {
    if (onCopyUrl) {
      onCopyUrl(url);
    } else {
      const fullUrl = formatShortUrl(url.short_url);

      navigator.clipboard.writeText(fullUrl);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 ${className}`}
      data-tour-id="dashboard-top-urls"
    >
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Top Performing URLs
      </h2>
      <div className="space-y-3">
        {urls.map((url) => (
          <div
            key={url.id}
            className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
          >
            <div className="flex-1">
              <a
                href={formatShortUrl(url.short_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {url.short_url}
              </a>
              <p className="text-sm text-gray-500">{url.original_url}</p>
              <p className="text-xs text-gray-400 mt-1">
                Created on {formatDate(url.created_at)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{url.clicks} clicks</span>
              <button
                onClick={() => handleCopy(url)}
                className="text-gray-500 hover:text-gray-700"
              >
                <RiFileCopyLine />
              </button>
              <a
                href={formatShortUrl(url.short_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
              >
                <RiExternalLinkLine />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformingUrls;
