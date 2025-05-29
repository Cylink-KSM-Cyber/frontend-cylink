"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { get } from "@/services/api";
import {
  UrlAnalyticsData,
  UrlAnalyticsParams,
  UrlAnalyticsResponse,
} from "@/interfaces/urlAnalytics";

interface UseAdvancedUrlAnalyticsParams extends UrlAnalyticsParams {
  urlId: number;
  autoFetch?: boolean;
}

interface UseAdvancedUrlAnalyticsReturn {
  analyticsData: UrlAnalyticsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  updateParams: (newParams: Partial<UrlAnalyticsParams>) => void;
  currentParams: UrlAnalyticsParams;
}

/**
 * Advanced URL Analytics Hook
 * @description Provides comprehensive analytics data with filtering and comparison capabilities
 * @param params - Analytics parameters including URL ID and filtering options
 * @returns Analytics data, loading state, error state, and control functions
 */
export const useAdvancedUrlAnalytics = ({
  urlId,
  autoFetch = true,
  start_date,
  end_date,
  group_by = "day",
  comparison,
  custom_comparison_start,
  custom_comparison_end,
  page = 1,
  limit = 30,
}: UseAdvancedUrlAnalyticsParams): UseAdvancedUrlAnalyticsReturn => {
  const [analyticsData, setAnalyticsData] = useState<UrlAnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Track current parameters
  const [currentParams, setCurrentParams] = useState<UrlAnalyticsParams>({
    start_date,
    end_date,
    group_by,
    comparison,
    custom_comparison_start,
    custom_comparison_end,
    page,
    limit,
  });

  // Use ref to track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  /**
   * Fetch analytics data with current parameters
   */
  const fetchAnalyticsData = useCallback(async () => {
    if (!urlId || !isMountedRef.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();

      if (currentParams.start_date)
        params.append("start_date", currentParams.start_date);
      if (currentParams.end_date)
        params.append("end_date", currentParams.end_date);
      if (currentParams.group_by)
        params.append("group_by", currentParams.group_by);
      if (currentParams.comparison)
        params.append("comparison", currentParams.comparison);
      if (currentParams.custom_comparison_start)
        params.append(
          "custom_comparison_start",
          currentParams.custom_comparison_start
        );
      if (currentParams.custom_comparison_end)
        params.append(
          "custom_comparison_end",
          currentParams.custom_comparison_end
        );
      if (currentParams.page)
        params.append("page", currentParams.page.toString());
      if (currentParams.limit)
        params.append("limit", currentParams.limit.toString());

      const queryString = params.toString();
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "v1";
      const endpoint = `/api/${apiVersion}/urls/${urlId}/analytics${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await get<UrlAnalyticsResponse>(endpoint);

      if (isMountedRef.current) {
        setAnalyticsData(response.data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch URL analytics");
        setError(error);
        console.error("Failed to fetch URL analytics:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [urlId, currentParams]);

  /**
   * Update analytics parameters and optionally refetch
   */
  const updateParams = useCallback((newParams: Partial<UrlAnalyticsParams>) => {
    setCurrentParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    await fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  // Auto-fetch when parameters change
  useEffect(() => {
    if (autoFetch) {
      fetchAnalyticsData();
    }
  }, [fetchAnalyticsData, autoFetch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    analyticsData,
    isLoading,
    error,
    refetch,
    updateParams,
    currentParams,
  };
};

export default useAdvancedUrlAnalytics;
