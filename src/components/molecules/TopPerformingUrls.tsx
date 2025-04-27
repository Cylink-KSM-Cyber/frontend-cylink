import React from "react";
import { Url } from "@/interfaces/url";
import { RiExternalLinkLine, RiFileCopyLine } from "react-icons/ri";

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
      navigator.clipboard.writeText(`https://${url.short_url}`);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Top Performing URLs
      </h2>
      <div className="space-y-3">
        {urls.map((url) => (
          <div
            key={url.id}
            className="p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium truncate">{url.short_url}</h3>
                <p
                  className="text-sm text-gray-500 truncate"
                  title={url.original_url}
                >
                  {url.original_url}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created on {formatDate(url.created_at)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold text-blue-600">
                  {url.clicks}
                </div>
                <div className="text-xs text-gray-500">clicks</div>
              </div>
            </div>
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={() => handleCopy(url)}
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                title="Copy URL"
              >
                <RiFileCopyLine className="w-4 h-4" />
              </button>
              <a
                href={`${url.short_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                title="Open URL"
              >
                <RiExternalLinkLine className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <a
          href="/dashboard/urls"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all URLs
        </a>
      </div>
    </div>
  );
};

export default TopPerformingUrls;
