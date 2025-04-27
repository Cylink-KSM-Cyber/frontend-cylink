"use client";

import { useState, useEffect, useCallback } from "react";
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
   * Fetch URL total clicks data from API
   */
  const fetchTotalClicks = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const queryString = buildQueryString(params);
      const endpoint = `/api/v1/urls/total-clicks${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await get<UrlTotalClicksResponse>(endpoint);

      if (response && response.data) {
        setData(response.data);

        // Transform time series data for the chart
        const chartData = transformTimeSeriesData(
          response.data.time_series.data
        );
        setTimeSeriesData(chartData);
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
    }
  }, [params, buildQueryString, transformTimeSeriesData]);

  // Fetch data on mount and when params change
  useEffect(() => {
    fetchTotalClicks();
  }, [fetchTotalClicks]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchTotalClicks,
    timeSeriesData,
  };
};
