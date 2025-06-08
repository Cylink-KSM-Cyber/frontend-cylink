"use client";

import React, { useState, useMemo, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { QrCodeCreateFormSchema } from "@/hooks/useQrCodeCreation";
import { Url } from "@/interfaces/url";
import SearchInput from "@/components/atoms/SearchInput";
import { formatDistanceToNow } from "date-fns";
import {
  RiLinkM,
  RiCalendarLine,
  RiEyeLine,
  RiStarLine,
  RiSearchLine,
} from "react-icons/ri";

/**
 * Props for URL Selection Step component
 */
interface UrlSelectionStepProps {
  /**
   * Form instance from react-hook-form
   */
  form: UseFormReturn<QrCodeCreateFormSchema>;
  /**
   * List of existing URLs
   */
  existingUrls: Url[];
  /**
   * Whether URLs are currently being loaded
   */
  isLoadingUrls: boolean;
}

/**
 * URL Selection Step Component for QR Code Creation
 *
 * @description First step in QR code creation process with intuitive search interface and recent URL cards
 */
const UrlSelectionStep: React.FC<UrlSelectionStepProps> = ({
  form,
  existingUrls,
  isLoadingUrls,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const selectedUrlId = watch("existingUrlId");

  // Format date to relative time
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  // Get recent URLs (last 6 URLs)
  const recentUrls = useMemo(() => {
    return existingUrls
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 6);
  }, [existingUrls]);

  // Get popular URLs (top 4 by clicks)
  const popularUrls = useMemo(() => {
    return existingUrls
      .filter((url) => url.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 4);
  }, [existingUrls]);

  // Filter URLs based on search query
  const filteredUrls = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return existingUrls.filter(
      (url) =>
        url.title?.toLowerCase().includes(query) ||
        url.original_url.toLowerCase().includes(query) ||
        url.short_url.toLowerCase().includes(query)
    );
  }, [existingUrls, searchQuery]);

  // Handle URL card selection
  const handleUrlSelect = (url: Url) => {
    setValue("urlSource", "existing");
    setValue("existingUrlId", url.id);
  };

  // Handle search with recent search tracking
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Add to recent searches if it's a meaningful search (>2 chars)
      if (query.trim().length > 2 && !recentSearches.includes(query.trim())) {
        setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]); // Keep last 5 searches
      }
    },
    [recentSearches]
  );

  // Handle recent search selection
  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  // Handle create new URL toggle
  const handleCreateNew = () => {
    setShowCreateForm(true);
    setValue("urlSource", "new");
    setValue("existingUrlId", null);
  };

  // Handle back to selection
  const handleBackToSelection = () => {
    setShowCreateForm(false);
    setValue("urlSource", "existing");
  };

  // URL Card Component with enhanced visual states
  const UrlCard: React.FC<{
    url: Url;
    isSelected: boolean;
    showClickCount?: boolean;
  }> = ({ url, isSelected, showClickCount = true }) => (
    <div
      onClick={() => handleUrlSelect(url)}
      className={`group p-4 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 truncate flex-1 mr-2 group-hover:text-blue-700 transition-colors">
          {url.title || `URL ${url.id}`}
        </h4>
        {showClickCount && (
          <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <RiEyeLine className="w-3 h-3 mr-1" />
            {url.clicks.toLocaleString()}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
          <RiLinkM className="w-3 h-3 mr-2 flex-shrink-0 text-gray-400" />
          <span className="truncate">{url.original_url}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <RiCalendarLine className="w-3 h-3 mr-1" />
            <span>{formatDate(url.created_at)}</span>
          </div>
          <div className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded group-hover:bg-blue-100 transition-colors">
            {url.short_url.replace("https://", "")}
          </div>
        </div>
      </div>
    </div>
  );

  // Show create new URL form
  if (showCreateForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Create New URL</h3>
          <button
            type="button"
            onClick={handleBackToSelection}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← Back to selection
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter a memorable title"
              {...register("title")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="originalUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Original URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="originalUrl"
              placeholder="https://"
              {...register("originalUrl")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.originalUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.originalUrl.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Custom Back-half (Optional)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                cylink.co/
              </span>
              <input
                type="text"
                id="customCode"
                placeholder="custom-url"
                {...register("customCode")}
                className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            {errors.customCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customCode.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="expiryDate"
              {...register("expiryDate")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Search your links
        </label>
        <SearchInput
          placeholder="Search your links..."
          onSearch={handleSearch}
          initialValue={searchQuery}
          className="w-full"
        />

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500">Recent searches</div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex items-center text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
                >
                  <RiSearchLine className="w-3 h-3 mr-1" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent URLs Section */}
      {!searchQuery && recentUrls.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Recent URLs</h3>
            <span className="text-xs text-gray-500">
              {recentUrls.length} items
            </span>
          </div>

          <div className="grid gap-3">
            {recentUrls.map((url) => (
              <UrlCard
                key={url.id}
                url={url}
                isSelected={selectedUrlId === url.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Search Results
            </h3>
            <span className="text-xs text-gray-500">
              {filteredUrls.length} results for &ldquo;{searchQuery}&rdquo;
            </span>
          </div>

          {filteredUrls.length > 0 ? (
            <div className="grid gap-3 max-h-80 overflow-y-auto">
              {filteredUrls.map((url) => (
                <UrlCard
                  key={url.id}
                  url={url}
                  isSelected={selectedUrlId === url.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <RiSearchLine className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 mb-4">
                No URLs found matching &ldquo;{searchQuery}&rdquo;
              </p>

              {/* Suggest popular URLs if available */}
              {popularUrls.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">
                    Try one of these popular URLs instead:
                  </p>
                  <div className="grid gap-2 max-w-md mx-auto">
                    {popularUrls.slice(0, 2).map((url) => (
                      <UrlCard
                        key={url.id}
                        url={url}
                        isSelected={selectedUrlId === url.id}
                        showClickCount={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoadingUrls && (
        <div className="text-center py-8">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading your URLs...</p>
        </div>
      )}

      {/* Empty State - No URLs */}
      {!isLoadingUrls && existingUrls.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <RiLinkM className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No URLs yet
          </h3>
          <p className="mb-6">Create your first URL to generate QR codes</p>

          {/* Suggestions for new users */}
          <div className="max-w-sm mx-auto bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-sm text-blue-700 mb-2">
              <RiStarLine className="w-4 h-4 mr-2" />
              <span className="font-medium">
                Popular categories to start with:
              </span>
            </div>
            <div className="text-xs text-blue-600 space-y-1">
              <div>• Social media profiles</div>
              <div>• Business websites</div>
              <div>• Portfolio links</div>
              <div>• Contact information</div>
            </div>
          </div>
        </div>
      )}

      {/* Create New URL Link */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCreateNew}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors hover:underline"
        >
          <span>Create new URL instead</span>
        </button>
      </div>

      {/* Validation Error */}
      {errors.existingUrlId && (
        <p className="text-sm text-red-600">Please select a URL to continue</p>
      )}
    </div>
  );
};

export default UrlSelectionStep;
