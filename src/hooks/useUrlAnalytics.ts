"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUrlAnalytics } from "@/services/url";
import { UrlAnalyticsData } from "@/interfaces/urlAnalytics";

interface UseUrlAnalyticsParams {
  urlId?: number;
  enableLazyLoading?: boolean;
}

interface UseUrlAnalyticsReturn {
  analyticsData: UrlAnalyticsData | null;
  isLoading: boolean;
  isLazyLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchAnalyticsData: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing URL analytics
 * @param options - Parameters for fetching URL analytics including URL ID
 * @returns URL analytics data, loading state, error state, and refetch function
 */
export const useUrlAnalytics = ({
  urlId,
  enableLazyLoading = false,
}: UseUrlAnalyticsParams): UseUrlAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<UrlAnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!enableLazyLoading);
  const [isLazyLoading, setIsLazyLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track previous urlId to prevent unnecessary fetches
  const prevUrlIdRef = useRef<number | undefined>(undefined);
  const hasInitiallyLoadedRef = useRef<boolean>(false);

  /**
   * Fetch URL analytics data from API
   */
  const fetchData = useCallback(async () => {
    // If no URL ID, don't fetch
    if (!urlId) {
      return;
    }

    // If we're lazy loading and this is the initial load, don't fetch yet
    if (enableLazyLoading && !hasInitiallyLoadedRef.current) {
      hasInitiallyLoadedRef.current = true;
      return;
    }

    // Skip fetching if the same URL ID is requested again and we already have data
    if (prevUrlIdRef.current === urlId && analyticsData) {
      console.log("Skipping duplicate analytics fetch for URL ID:", urlId);
      return;
    }

    // Set appropriate loading state based on whether this is initial or lazy load
    if (enableLazyLoading) {
      setIsLazyLoading(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await fetchUrlAnalytics(urlId);
      setAnalyticsData(response.data);

      // Update refs after successful fetch
      prevUrlIdRef.current = urlId;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch URL analytics")
      );
      console.error("Failed to fetch URL analytics:", err);
    } finally {
      setIsLoading(false);
      setIsLazyLoading(false);
    }
  }, [urlId, enableLazyLoading, analyticsData]);

  // Manual fetch function for lazy loading
  const fetchAnalyticsData = useCallback(async () => {
    if (!urlId) {
      return;
    }

    setIsLazyLoading(true);
    setError(null);

    try {
      const response = await fetchUrlAnalytics(urlId);
      setAnalyticsData(response.data);
      prevUrlIdRef.current = urlId;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch URL analytics")
      );
      console.error("Failed to fetch URL analytics:", err);
    } finally {
      setIsLazyLoading(false);
    }
  }, [urlId]);

  // Fetch data when urlId changes, but only if not using lazy loading
  useEffect(() => {
    if (!enableLazyLoading) {
      fetchData();
    }
  }, [fetchData, enableLazyLoading]);

  return {
    analyticsData,
    isLoading,
    isLazyLoading,
    error,
    refetch: fetchData,
    fetchAnalyticsData,
  };
};

export default useUrlAnalytics;
