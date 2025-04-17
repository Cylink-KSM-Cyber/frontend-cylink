/**
 * @file useTotalUrls.ts
 * @description Custom hook for fetching the total number of URLs from the API
 */

import { useState, useEffect } from "react";
import { get } from "@/services/api";
import { UrlTotalCountResponse } from "@/interfaces/url";

/**
 * Custom hook for fetching the total number of URLs
 * @returns Object containing total URLs count, loading state, error state, and refresh function
 */
export const useTotalUrls = () => {
  const [totalUrls, setTotalUrls] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch total URLs count from the API
   */
  const fetchTotalUrls = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Endpoint sesuai dengan dokumentasi API
      const endpoint = "/api/v1/urls?limit=1";
      console.log("Fetching total URLs count from endpoint:", endpoint);

      const response = await get<UrlTotalCountResponse>(endpoint);
      console.log("Total URLs API response:", response);

      if (
        response &&
        response.pagination &&
        typeof response.pagination.total === "number"
      ) {
        console.log("Setting total URLs to:", response.pagination.total);
        setTotalUrls(response.pagination.total);
      } else {
        console.error("Pagination structure not found:", response);
        setError(new Error("Pagination structure not found in API response"));
      }
    } catch (err) {
      console.error("Failed to fetch total URLs count:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch total URLs count")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch total URLs count on component mount
  useEffect(() => {
    fetchTotalUrls();
  }, []);

  /**
   * Refresh total URLs count
   * @returns Promise that resolves when refresh is complete
   */
  const refreshTotalUrls = async () => {
    return fetchTotalUrls();
  };

  return {
    totalUrls,
    isLoading,
    error,
    refreshTotalUrls,
  };
};

export default useTotalUrls;
