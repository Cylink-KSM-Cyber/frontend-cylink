"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUrlAnalytics } from "@/services/url";
import { UrlAnalyticsData } from "@/interfaces/urlAnalytics";

interface UseUrlAnalyticsParams {
  urlId?: number;
}

interface UseUrlAnalyticsReturn {
  analyticsData: UrlAnalyticsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing URL analytics
 * @param params - Parameters for fetching URL analytics including URL ID
 * @returns URL analytics data, loading state, error state, and refetch function
 */
export const useUrlAnalytics = (
  params: UseUrlAnalyticsParams
): UseUrlAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<UrlAnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track previous urlId to prevent unnecessary fetches
  const prevUrlIdRef = useRef<number | undefined>(undefined);

  /**
   * Fetch URL analytics data from API
   */
  const fetchData = useCallback(async () => {
    // If no URL ID, don't fetch
    if (!params.urlId) {
      return;
    }

    // Skip fetching if the same URL ID is requested again
    if (prevUrlIdRef.current === params.urlId) {
      console.log(
        "Skipping duplicate analytics fetch for URL ID:",
        params.urlId
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchUrlAnalytics(params.urlId);
      setAnalyticsData(response.data);

      // Update refs after successful fetch
      prevUrlIdRef.current = params.urlId;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch URL analytics")
      );
      console.error("Failed to fetch URL analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [params.urlId]);

  // Fetch data when urlId changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    analyticsData,
    isLoading,
    error,
    refetch: fetchData,
  };
};

export default useUrlAnalytics;
