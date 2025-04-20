import { useState, useEffect, useCallback } from "react";
import { get } from "@/services/api";
import { CtrStatsResponse, CtrStatsParams } from "@/interfaces/url";

/**
 * Prepare query parameters for CTR statistics API
 * @param params - The API parameters
 * @returns URLSearchParams object
 */
const prepareQueryParams = (params?: CtrStatsParams): URLSearchParams => {
  const queryParams = new URLSearchParams();

  if (!params) return queryParams;

  if (params.start_date) queryParams.append("start_date", params.start_date);
  if (params.end_date) queryParams.append("end_date", params.end_date);
  if (params.comparison) queryParams.append("comparison", params.comparison);
  if (params.custom_comparison_start)
    queryParams.append(
      "custom_comparison_start",
      params.custom_comparison_start
    );
  if (params.custom_comparison_end)
    queryParams.append("custom_comparison_end", params.custom_comparison_end);
  if (params.group_by) queryParams.append("group_by", params.group_by);

  return queryParams;
};

// /**
//  * Parse string or number value to number
//  * @param value - The value to parse
//  * @returns Parsed number or 0
//  */
// const parseNumericValue = (value: string | number | undefined): number => {
//   if (typeof value === "string") return parseFloat(value) || 0;
//   if (typeof value === "number") return value;
//   return 0;
// };

/**
 * Process API response data to ensure numeric values
 * @param responseData - The API response data
 * @returns Processed data with numeric values
 */
const processApiData = (
  responseData: CtrStatsResponse["data"]
): CtrStatsResponse["data"] => {
  if (!responseData?.overall) return responseData;

  return {
    ...responseData,
    overall: {
      total_impressions: responseData?.overall?.total_impressions,
      total_clicks: responseData?.overall?.total_clicks,
      ctr: responseData?.overall?.ctr,
      unique_ctr: responseData?.overall?.unique_ctr,
      unique_impressions: responseData?.overall?.unique_impressions,
      analysis_period: {
        days: responseData?.overall?.analysis_period?.days,
        start_date: responseData?.overall?.analysis_period?.start_date,
        end_date: responseData?.overall?.analysis_period?.end_date,
      },
    },
    ctr_by_source: responseData.ctr_by_source,
    top_performing_days: responseData.top_performing_days,
  };
};

/**
 * Custom hook for fetching CTR statistics analytics data
 * @param params - Request parameters for the CTR statistics API
 * @returns Object containing the CTR statistics data, loading state, error state, and refresh function
 */
export const useCtrStats = (params?: CtrStatsParams) => {
  const [ctrStats, setCtrStats] = useState<CtrStatsResponse["data"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCtrStats = useCallback(async () => {
    // Skip duplicate API calls if already loaded and not forced refresh
    if (ctrStats && !isLoading) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "Skipping duplicate CTR statistics API call, data already loaded"
        );
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const queryParams = prepareQueryParams(params);
      const queryString = queryParams.toString();
      const endpoint = `/api/v1/ctr/stats${
        queryString ? `?${queryString}` : ""
      }`;

      if (process.env.NODE_ENV === "development") {
        console.log(`Fetching CTR statistics data from: ${endpoint}`);
      }

      const response = await get<CtrStatsResponse>(endpoint);

      if (process.env.NODE_ENV === "development") {
        console.log("CTR statistics data response:", response);
      }

      if (response.status === 200 && response.data) {
        // Process the API response to ensure numeric values are properly parsed
        const processedData = processApiData(response.data);

        if (process.env.NODE_ENV === "development") {
          console.log("Processed data:", processedData);
        }

        // Set the processed data
        setCtrStats(processedData);
      } else {
        throw new Error(
          `Failed to fetch CTR statistics data: ${response.message}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Failed to fetch CTR statistics data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    params, // Using params directly as a dependency
    ctrStats,
    isLoading,
  ]);

  // Use a separate effect to trigger the initial fetch
  useEffect(() => {
    console.log("useCtrStats: Initial fetch trigger");

    // Only fetch if we don't have data or params have changed
    if (!ctrStats || isLoading) {
      fetchCtrStats();
    }

    // Cleanup function
    return () => {
      // No cleanup needed
    };
  }, [fetchCtrStats, ctrStats, isLoading]);

  /**
   * Refresh CTR statistics data
   * @returns Promise that resolves when refresh is complete
   */
  const refreshCtrStats = async () => {
    // Reset the data to force a refresh
    setCtrStats(null);
    await fetchCtrStats();
  };

  return {
    ctrStats,
    isLoading,
    error,
    refreshCtrStats,
  };
};
