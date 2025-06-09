"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { get } from "@/services/api";
import {
  UrlTotalClicksData,
  UrlTotalClicksParams,
  UrlTotalClicksResponse,
} from "@/interfaces/urlTotalClicks";
import { ChartDataPoint } from "@/interfaces/dashboard";
import AuthService from "@/services/auth";
import { AxiosError } from "axios";

interface UseUrlTotalClicksReturn {
  data: UrlTotalClicksData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  timeSeriesData: ChartDataPoint[];
}

/**
 * Custom hook for fetching URL total clicks analytics data
 *
 * @param params - Parameters for the URL total clicks API
 * @returns URL total clicks data, loading state, error state, and refetch function
 */
export const useUrlTotalClicks = (
  params: UrlTotalClicksParams = {
    comparison: "30",
    group_by: "day",
    limit: 30,
    page: 1,
  }
): UseUrlTotalClicksReturn => {
  // Single source of truth for data state
  const [apiResponse, setApiResponse] = useState<{
    data: UrlTotalClicksData | null;
    timeSeriesData: ChartDataPoint[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  }>({
    data: null,
    timeSeriesData: [],
    isLoading: true,
    isError: false,
    error: null,
  });

  // Use ref to store the latest params and prevent unnecessary fetches
  const paramsRef = useRef<UrlTotalClicksParams>(params);
  // Use ref to track if a fetch is already in progress
  const fetchInProgressRef = useRef<boolean>(false);
  // Use ref to track if data has been fetched at least once
  const hasDataBeenFetchedRef = useRef<boolean>(false);
  // Use ref to track the current effect instance
  const effectInstanceRef = useRef<number>(0);

  /**
   * Build the query string from parameters
   */
  const buildQueryString = useCallback(
    (params: UrlTotalClicksParams): string => {
      const queryParams = new URLSearchParams();

      if (params.start_date)
        queryParams.append("start_date", params.start_date);
      if (params.end_date) queryParams.append("end_date", params.end_date);
      if (params.comparison)
        queryParams.append("comparison", params.comparison);
      if (params.custom_comparison_start)
        queryParams.append(
          "custom_comparison_start",
          params.custom_comparison_start
        );
      if (params.custom_comparison_end)
        queryParams.append(
          "custom_comparison_end",
          params.custom_comparison_end
        );
      if (params.group_by) queryParams.append("group_by", params.group_by);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      return queryParams.toString();
    },
    []
  );

  /**
   * Transform time series data to ChartDataPoint format
   */
  const transformTimeSeriesData = useCallback(
    (
      timeSeriesData: UrlTotalClicksData["time_series"]["data"]
    ): ChartDataPoint[] => {
      console.log("[DEBUG] transformTimeSeriesData input:", timeSeriesData);

      if (!timeSeriesData || !Array.isArray(timeSeriesData)) {
        console.warn("[DEBUG] Invalid timeSeriesData:", {
          timeSeriesData,
          isArray: Array.isArray(timeSeriesData),
        });
        return [];
      }

      const validData = timeSeriesData.filter((item) => {
        if (!item || !item.date) {
          console.warn(
            "[DEBUG] Invalid item filtered out (missing item or date):",
            item
          );
          return false;
        }

        // Convert string clicks to number if needed
        const clicksValue =
          typeof item.clicks === "string"
            ? parseInt(item.clicks, 10)
            : item.clicks;
        const isValidClicks =
          typeof clicksValue === "number" &&
          !isNaN(clicksValue) &&
          clicksValue >= 0;

        if (!isValidClicks) {
          console.warn(
            "[DEBUG] Invalid item filtered out (invalid clicks):",
            item
          );
          return false;
        }

        return true;
      });

      console.log("[DEBUG] Valid items after filter:", validData);

      const transformedData = validData.map((item) => {
        // Convert string clicks to number for chart
        const clicksValue =
          typeof item.clicks === "string"
            ? parseInt(item.clicks, 10)
            : item.clicks;

        const transformed = {
          date: item.date,
          value: clicksValue || 0,
          label: `${clicksValue || 0}`,
        };

        console.log("[DEBUG] Item transformation:", {
          original: item,
          transformed,
        });
        return transformed;
      });

      console.log("[DEBUG] Final transformed data:", transformedData);
      return transformedData;
    },
    []
  );

  /**
   * Checks if params have changed enough to warrant a new fetch
   */
  const haveParamsChanged = useCallback(
    (
      prevParams: UrlTotalClicksParams,
      newParams: UrlTotalClicksParams
    ): boolean => {
      // Check if any important params have changed
      return (
        prevParams.comparison !== newParams.comparison ||
        prevParams.group_by !== newParams.group_by ||
        prevParams.limit !== newParams.limit ||
        prevParams.start_date !== newParams.start_date ||
        prevParams.end_date !== newParams.end_date ||
        prevParams.custom_comparison_start !==
          newParams.custom_comparison_start ||
        prevParams.custom_comparison_end !== newParams.custom_comparison_end
      );
    },
    []
  );

  /**
   * Fetch URL total clicks data from API
   */
  const fetchTotalClicks = useCallback(
    async (effectInstance?: number) => {
      // If an effect instance is provided, make sure it matches the current one
      if (
        effectInstance !== undefined &&
        effectInstance !== effectInstanceRef.current
      ) {
        return;
      }

      // Prevent concurrent fetches
      if (fetchInProgressRef.current) {
        return;
      }

      // Check authentication before making API call
      const isAuthenticated = AuthService.isAuthenticated();
      const token = AuthService.getAccessToken();

      if (!isAuthenticated || !token) {
        setApiResponse({
          data: null,
          timeSeriesData: [],
          isLoading: false,
          isError: true,
          error: new Error("Authentication required. Please log in again."),
        });
        return;
      }

      // Check if params have changed enough to justify a new fetch
      if (
        hasDataBeenFetchedRef.current &&
        !haveParamsChanged(paramsRef.current, params)
      ) {
        return;
      }

      // Update the params ref to the latest values
      paramsRef.current = { ...params };
      fetchInProgressRef.current = true;

      // Set loading state immediately
      setApiResponse((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        const queryString = buildQueryString(params);
        const endpoint = `/api/v1/urls/total-clicks${
          queryString ? `?${queryString}` : ""
        }`;

        const response = await get<UrlTotalClicksResponse>(endpoint);

        // Check if the effect instance is still current
        if (
          effectInstance !== undefined &&
          effectInstance !== effectInstanceRef.current
        ) {
          return;
        }

        if (response?.data) {
          // Validate response data structure
          const timeSeriesData = response.data.time_series?.data || [];

          // Temporary debug logging to see actual API response
          console.group("[DEBUG] API Response Analysis");
          console.log("Full API Response:", response);
          console.log("Response Data Structure:", {
            hasData: !!response.data,
            hasSummary: !!response.data.summary,
            hasTimeSeries: !!response.data.time_series,
            timeSeriesDataArray: timeSeriesData,
            timeSeriesLength: timeSeriesData.length,
            firstTimeSeriesItem: timeSeriesData[0],
          });
          console.groupEnd();

          // Transform time series data for the chart
          const chartData = transformTimeSeriesData(timeSeriesData);

          console.log("[DEBUG] Transformation Result:", {
            originalDataLength: timeSeriesData.length,
            transformedDataLength: chartData.length,
            transformedData: chartData,
          });

          // Update all states atomically with original data structure
          setApiResponse({
            data: response.data,
            timeSeriesData: chartData,
            isLoading: false,
            isError: false,
            error: null,
          });

          hasDataBeenFetchedRef.current = true;
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        // Handle authentication errors specifically
        let errorMessage = "Failed to fetch URL total clicks";
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as AxiosError;
          if (axiosError.response?.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
            // Clear tokens on 401 error
            AuthService.clearTokens();
          }
        }

        setApiResponse((prev) => ({
          ...prev,
          isLoading: false,
          isError: true,
          error: err instanceof Error ? err : new Error(errorMessage),
        }));
      } finally {
        fetchInProgressRef.current = false;
      }
    },
    [params, buildQueryString, transformTimeSeriesData, haveParamsChanged]
  );

  // Pre-load data with eager loading strategy
  useMemo(() => {
    // Trigger immediate fetch on first render
    if (!hasDataBeenFetchedRef.current) {
      fetchTotalClicks();
    }
  }, [fetchTotalClicks]);

  // Fetch data when params change
  useEffect(() => {
    // Increment the effect instance to track which instance is current
    effectInstanceRef.current += 1;
    const currentEffectInstance = effectInstanceRef.current;

    // Fetch data with the current effect instance
    fetchTotalClicks(currentEffectInstance);

    // Cleanup function to handle component unmount
    return () => {
      // Nothing to cleanup as we're using the effect instance pattern
    };
  }, [fetchTotalClicks]);

  return {
    data: apiResponse.data,
    isLoading: apiResponse.isLoading,
    isError: apiResponse.isError,
    error: apiResponse.error,
    refetch: () => fetchTotalClicks(), // Pass no instance to force a refresh
    timeSeriesData: apiResponse.timeSeriesData,
  };
};
