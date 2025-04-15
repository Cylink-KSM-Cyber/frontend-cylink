"use client";

import { useState, useEffect, useCallback } from "react";
import { Url, UrlFilter } from "@/interfaces/url";
import { fetchUrls } from "@/services/url";

/**
 * Custom hook for fetching and managing URLs
 * @param initialFilter - Initial filter settings
 * @returns URL data, loading state, and management functions
 */
export const useUrls = (
  initialFilter: UrlFilter = {
    page: 1,
    limit: 10,
    sortBy: "created_at",
    sortOrder: "desc",
  }
) => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [filter, setFilter] = useState<UrlFilter>(initialFilter);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  });

  /**
   * Fetch URLs based on current filter
   */
  const fetchUrlData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchUrls(filter);
      console.log("URL API response:", response);
      setUrls(response.data.urls);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch URLs"));
      console.error("Failed to fetch URLs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUrlData();
  }, [fetchUrlData]);

  /**
   * Update filter settings
   * @param newFilter - New filter settings to apply
   */
  const updateFilter = (newFilter: Partial<UrlFilter>) => {
    console.log("Updating filter with:", newFilter);

    // Membuat salinan objek newFilter untuk modifikasi
    const updatedNewFilter = { ...newFilter };

    // Memeriksa apakah ada nilai di properti sortBy yang tidak valid
    if (
      "sortBy" in updatedNewFilter &&
      updatedNewFilter.sortBy &&
      !["created_at", "clicks", "title"].includes(updatedNewFilter.sortBy)
    ) {
      // Reset ke nilai default jika tidak valid
      updatedNewFilter.sortBy = "created_at";
      console.log("Invalid sortBy value detected, reset to created_at");
    }

    setFilter((prevFilter) => {
      const updatedFilter = {
        ...prevFilter,
        ...updatedNewFilter,
        // Reset to page 1 if any filter other than page changes
        page: updatedNewFilter.page !== undefined ? updatedNewFilter.page : 1,
      };
      console.log("Updated filter:", updatedFilter);
      return updatedFilter;
    });
  };

  /**
   * Delete a URL
   * @param id - ID of URL to delete
   */
  const deleteUrl = async (id: number) => {
    try {
      // This will be replaced with actual API call
      // For now, just simulate deletion
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        total_pages: Math.ceil((prev.total - 1) / filter.limit),
      }));
      return true;
    } catch (err) {
      console.error(`Failed to delete URL ${id}:`, err);
      return false;
    }
  };

  /**
   * Update URL active status
   * @param id - ID of URL to update
   * @param isActive - New active status
   */
  const updateUrlStatus = async (id: number, isActive: boolean) => {
    try {
      // This will be replaced with actual API call
      // For now, just simulate updating
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === id ? { ...url, is_active: isActive } : url
        )
      );
      return true;
    } catch (err) {
      console.error(`Failed to update URL ${id} status:`, err);
      return false;
    }
  };

  return {
    urls,
    isLoading,
    error,
    pagination,
    filter,
    updateFilter,
    refreshUrls: fetchUrlData,
    deleteUrl,
    updateUrlStatus,
  };
};
