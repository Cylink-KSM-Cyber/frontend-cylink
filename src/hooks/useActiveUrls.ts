"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchUrls } from "@/services/url";

/**
 * @description Fetches URLs with status=active to get accurate count for dashboard stats
 * @returns Active URLs count, loading state, and refresh function
 */
export const useActiveUrls = () => {
  const [activeUrlsCount, setActiveUrlsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch active URLs count from API
   */
  const fetchActiveUrlsCount = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch URLs with active status filter
      const response = await fetchUrls({
        status: "active",
        page: 1,
        limit: 1, // We only need the total count, not the actual data
        sortBy: "created_at",
        sortOrder: "desc",
      });

      if (response?.pagination?.total !== undefined) {
        setActiveUrlsCount(response.pagination.total);
      } else {
        console.error("Unexpected API response structure:", response);
        setError(new Error("Failed to get active URLs count"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch active URLs")
      );
      console.error("Failed to fetch active URLs:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch active URLs count on mount
  useEffect(() => {
    fetchActiveUrlsCount();
  }, [fetchActiveUrlsCount]);

  /**
   * Manually refresh active URLs count
   */
  const refreshActiveUrls = useCallback(() => {
    return fetchActiveUrlsCount();
  }, [fetchActiveUrlsCount]);

  return {
    activeUrlsCount,
    isLoading,
    error,
    refreshActiveUrls,
  };
};
