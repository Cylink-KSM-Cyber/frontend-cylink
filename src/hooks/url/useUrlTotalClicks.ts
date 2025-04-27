"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { get } from "@/services/api";
import {
  UrlTotalClicksData,
  UrlTotalClicksParams,
  UrlTotalClicksResponse,
} from "@/interfaces/urlTotalClicks";
import { ChartDataPoint } from "@/interfaces/dashboard";

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
  const [data, setData] = useState<UrlTotalClicksData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<ChartDataPoint[]>([]);

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
      return timeSeriesData.map((item) => ({
        date: item.date,
        value: item.clicks,
        label: `${item.clicks} clicks (${item.urls_count} URLs)`,
      }));
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
        console.log("Stale effect instance, skipping...");
        return;
      }

      // Prevent concurrent fetches
      if (fetchInProgressRef.current) {
        console.log("Fetch already in progress, skipping...");
        return;
      }

      // Check if params have changed enough to justify a new fetch
      if (
        hasDataBeenFetchedRef.current &&
        !haveParamsChanged(paramsRef.current, params)
      ) {
        console.log("Params unchanged, skipping fetch...");
        return;
      }

      // Update the params ref to the latest values
      paramsRef.current = { ...params };
      fetchInProgressRef.current = true;

      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const queryString = buildQueryString(params);
        const endpoint = `/api/v1/urls/total-clicks${
          queryString ? `?${queryString}` : ""
        }`;

        console.log(`Fetching URL total clicks from ${endpoint}`);
        const response = await get<UrlTotalClicksResponse>(endpoint);

        // Check if the effect instance is still current
        if (
          effectInstance !== undefined &&
          effectInstance !== effectInstanceRef.current
        ) {
          console.log(
            "Effect instance changed during fetch, discarding result..."
          );
          return;
        }

        if (response && response.data) {
          setData(response.data);

          // Transform time series data for the chart
          const chartData = transformTimeSeriesData(
            response.data.time_series.data
          );
          setTimeSeriesData(chartData);
          hasDataBeenFetchedRef.current = true;
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Failed to fetch URL total clicks:", err);
        setIsError(true);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch URL total clicks")
        );
      } finally {
        setIsLoading(false);
        fetchInProgressRef.current = false;
      }
    },
    [params, buildQueryString, transformTimeSeriesData, haveParamsChanged]
  );

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
    data,
    isLoading,
    isError,
    error,
    refetch: () => fetchTotalClicks(), // Pass no instance to force a refresh
    timeSeriesData,
  };
};
