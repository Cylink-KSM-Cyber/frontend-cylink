import { useState, useEffect } from "react";
import { get } from "@/services/api";
import { TotalClicksResponse, TotalClicksParams } from "@/interfaces/url";

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

  const fetchTotalClicks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const queryParams = new URLSearchParams();

      if (params) {
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
      }

      const queryString = queryParams.toString();
      const endpoint = `/api/v1/urls/total-clicks${
        queryString ? `?${queryString}` : ""
      }`;

      console.log(`Fetching total clicks data from: ${endpoint}`);

      const response = await get<TotalClicksResponse>(endpoint);

      console.log("Total clicks data response:", response);

      if (response.status === 200 && response.data) {
        // Process the API response to ensure numeric values are properly parsed
        const processedData = {
          ...response.data,
          summary: {
            ...response.data.summary,
            // Parse string values to numbers
            total_clicks:
              typeof response.data.summary.total_clicks === "string"
                ? parseFloat(response.data.summary.total_clicks) || 0
                : response.data.summary.total_clicks || 0,
            total_urls:
              typeof response.data.summary.total_urls === "string"
                ? parseFloat(response.data.summary.total_urls) || 0
                : response.data.summary.total_urls || 0,
            avg_clicks_per_url:
              typeof response.data.summary.avg_clicks_per_url === "string"
                ? parseFloat(response.data.summary.avg_clicks_per_url) || 0
                : response.data.summary.avg_clicks_per_url || 0,
            comparison: {
              ...response.data.summary.comparison,
              total_clicks: {
                ...response.data.summary.comparison.total_clicks,
                // Parse string values to numbers
                current:
                  typeof response.data.summary.comparison.total_clicks
                    .current === "string"
                    ? parseFloat(
                        response.data.summary.comparison.total_clicks.current
                      ) || 0
                    : response.data.summary.comparison.total_clicks.current ||
                      0,
                previous:
                  typeof response.data.summary.comparison.total_clicks
                    .previous === "string"
                    ? parseFloat(
                        response.data.summary.comparison.total_clicks.previous
                      ) || 0
                    : response.data.summary.comparison.total_clicks.previous ||
                      0,
              },
              avg_clicks_per_url: {
                ...response.data.summary.comparison.avg_clicks_per_url,
                // Parse string values to numbers
                current:
                  typeof response.data.summary.comparison.avg_clicks_per_url
                    .current === "string"
                    ? parseFloat(
                        response.data.summary.comparison.avg_clicks_per_url
                          .current
                      ) || 0
                    : response.data.summary.comparison.avg_clicks_per_url
                        .current || 0,
                previous:
                  typeof response.data.summary.comparison.avg_clicks_per_url
                    .previous === "string"
                    ? parseFloat(
                        response.data.summary.comparison.avg_clicks_per_url
                          .previous
                      ) || 0
                    : response.data.summary.comparison.avg_clicks_per_url
                        .previous || 0,
              },
            },
          },
        };

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
  };

  useEffect(() => {
    fetchTotalClicks();
  }, [
    params?.start_date,
    params?.end_date,
    params?.comparison,
    params?.custom_comparison_start,
    params?.custom_comparison_end,
    params?.group_by,
    params?.page,
    params?.limit,
  ]);

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
