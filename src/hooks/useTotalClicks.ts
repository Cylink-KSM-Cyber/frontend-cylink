import { useState, useEffect, useCallback } from "react";
import { get } from "@/services/api";
import { TotalClicksResponse, TotalClicksParams } from "@/interfaces/url";

/**
 * Prepare query parameters for total clicks API
 * @param params - The API parameters
 * @returns URLSearchParams object
 */
const prepareQueryParams = (params?: TotalClicksParams): URLSearchParams => {
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
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  return queryParams;
};

/**
 * Parse string or number value to number
 * @param value - The value to parse
 * @returns Parsed number or 0
 */
const parseNumericValue = (value: string | number | undefined): number => {
  if (typeof value === "string") return parseFloat(value) || 0;
  if (typeof value === "number") return value;
  return 0;
};

/**
 * Process API response data to ensure numeric values
 * @param responseData - The API response data
 * @returns Processed data with numeric values
 */
const processApiData = (
  responseData: TotalClicksResponse["data"]
): TotalClicksResponse["data"] => {
  if (!responseData?.summary) return responseData;

  return {
    ...responseData,
    summary: {
      ...responseData.summary,
      total_clicks: parseNumericValue(responseData.summary.total_clicks),
      total_urls: parseNumericValue(responseData.summary.total_urls),
      avg_clicks_per_url: parseNumericValue(
        responseData.summary.avg_clicks_per_url
      ),
      comparison: {
        ...responseData.summary.comparison,
        total_clicks: {
          ...responseData.summary.comparison.total_clicks,
          current: parseNumericValue(
            responseData.summary.comparison.total_clicks.current
          ),
          previous: parseNumericValue(
            responseData.summary.comparison.total_clicks.previous
          ),
        },
        avg_clicks_per_url: {
          ...responseData.summary.comparison.avg_clicks_per_url,
          current: parseNumericValue(
            responseData.summary.comparison.avg_clicks_per_url.current
          ),
          previous: parseNumericValue(
            responseData.summary.comparison.avg_clicks_per_url.previous
          ),
        },
      },
    },
  };
};

/**
 * Custom hook for fetching total clicks analytics data
 * @param params - Request parameters for the total clicks API
 * @returns Object containing the total clicks data, loading state, error state, and refresh function
 */
export const useTotalClicks = (params?: TotalClicksParams) => {
  const [totalClicksData, setTotalClicksData] = useState<
    TotalClicksResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTotalClicks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const queryParams = prepareQueryParams(params);
      const queryString = queryParams.toString();
      const endpoint = `/api/v1/urls/total-clicks${
        queryString ? `?${queryString}` : ""
      }`;

      console.log(`Fetching total clicks data from: ${endpoint}`);
      const response = await get<TotalClicksResponse>(endpoint);
      console.log("Total clicks data response:", response);

      if (response.status === 200 && response.data) {
        // Process the API response to ensure numeric values are properly parsed
        const processedData = processApiData(response.data);
        console.log("Processed data:", processedData);

        // Set the processed data
        setTotalClicksData(processedData);
      } else {
        throw new Error(
          `Failed to fetch total clicks data: ${response.message}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Failed to fetch total clicks data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTotalClicks();
  }, [fetchTotalClicks]);

  /**
   * Refresh total clicks data
   * @returns Promise that resolves when refresh is complete
   */
  const refreshTotalClicks = async () => {
    await fetchTotalClicks();
  };

  return {
    totalClicksData,
    isLoading,
    error,
    refreshTotalClicks,
  };
};
