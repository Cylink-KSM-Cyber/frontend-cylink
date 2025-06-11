"use client";

import { useState, useEffect, useCallback } from "react";
import { Url, UrlFilter } from "@/interfaces/url";
import { fetchUrls, updateUrlStatusById, deleteUrlById } from "@/services/url";
import { useToast } from "@/contexts/ToastContext";

/**
 * Custom hook for fetching and managing URLs
 * @param initialFilter - Initial filter settings
 * @returns URL data, loading state, and management functions
 */
export const useUrls = (
  initialFilter: UrlFilter = {
    search: "",
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
  const { showToast } = useToast();

  /**
   * Fetch URLs based on current filter
   */
  const fetchUrlData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching URLs with filter:", filter);

    try {
      const response = await fetchUrls(filter);
      console.log("URL API response:", response);

      if (response?.data) {
        console.log("URLs from API:", response.data);
        console.log("URLs count:", response.data.length);

        setUrls(response.data);

        if (response.pagination) {
          console.log("Pagination data:", response.pagination);
          setPagination(response.pagination);
        }

        console.log("State updated with URLs, count:", response.data.length);
      } else {
        console.error("Unexpected API response structure:", response);
        setError(new Error("Unexpected API response structure"));
        setUrls([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch URLs"));
      console.error("Failed to fetch URLs:", err);
    } finally {
      setIsLoading(false);
      console.log("Loading state set to false");
    }
  }, [filter]);

  // Fetch URLs when filter changes
  useEffect(() => {
    fetchUrlData();
  }, [fetchUrlData]);

  /**
   * Update filter settings
   * @param newFilter - New filter settings to apply
   */
  const updateFilter = (newFilter: Partial<UrlFilter>) => {
    console.log("Updating filter with:", newFilter);

    // Create a copy of newFilter for modification
    const updatedNewFilter = { ...newFilter };

    // Check if sortBy contains an invalid value
    if (
      "sortBy" in updatedNewFilter &&
      updatedNewFilter.sortBy &&
      !["created_at", "clicks", "title", "expiry_date"].includes(
        updatedNewFilter.sortBy
      )
    ) {
      // Reset to default value if invalid
      updatedNewFilter.sortBy = "created_at";
      console.log("Invalid sortBy value detected, reset to created_at");
    }

    setFilter((prevFilter) => {
      const updatedFilter = {
        ...prevFilter,
        ...updatedNewFilter,
        // Reset to page 1 if any filter other than page changes
        page: updatedNewFilter.page ?? 1,
      };
      console.log("Updated filter:", updatedFilter);
      return updatedFilter;
    });
  };

  /**
   * Manually refresh URL data
   */
  const refreshUrls = useCallback(() => {
    console.log("Manually refreshing URLs");
    return fetchUrlData();
  }, [fetchUrlData]);

  /**
   * Update URL status (active/inactive)
   * @param id - ID of the URL to update
   * @param isActive - New active status
   * @returns Promise resolving to success status
   */
  const updateUrlStatus = useCallback(
    async (id: number, isActive: boolean): Promise<boolean> => {
      try {
        await updateUrlStatusById(id, isActive);
        // Refresh URLs after status update
        await fetchUrlData();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update URL status")
        );
        console.error("Failed to update URL status:", err);
        return false;
      }
    },
    [fetchUrlData]
  );

  /**
   * Delete a URL by ID
   * @param id - ID of the URL to delete
   * @returns Promise resolving to the success status
   */
  const deleteUrl = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        const response = await deleteUrlById(id);

        // Display success toast
        showToast(
          `Successfully deleted URL "${response.data.short_code}"`,
          "white",
          4000
        );

        // Refresh URLs after deletion
        await fetchUrlData();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete URL";

        setError(err instanceof Error ? err : new Error(errorMessage));

        // Display error toast
        showToast(errorMessage, "error", 4000);
        return false;
      }
    },
    [showToast, fetchUrlData]
  );

  return {
    urls,
    isLoading,
    error,
    pagination,
    filter,
    updateFilter,
    refreshUrls,
    updateUrlStatus,
    deleteUrl,
  };
};

export default useUrls;
