import { useState, useEffect, useMemo } from "react";
import {
  ConversionRateParams,
  ConversionRateResponse,
  ConversionDashboardStats,
} from "@/interfaces/conversion";
import { getConversionRate } from "@/services/conversion";

/**
 * Custom hook for fetching and managing conversion rate data
 * @param params - Optional parameters for the conversion rate API
 * @returns Object containing conversion rate data, loading state, error state, and refresh function
 */
export const useConversionRate = (params?: ConversionRateParams) => {
  const [data, setData] = useState<ConversionRateResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoize parameters to prevent unnecessary re-renders
  const memoizedParams = useMemo(
    () => params,
    [params?.start_date, params?.end_date, params?.goal_id, params?.comparison]
  );

  // Processed stats for dashboard display
  const conversionStats: ConversionDashboardStats | null = useMemo(() => {
    if (!data) return null;

    return {
      conversionRate: data.data.overall_stats.conversion_rate,
      conversionChangePercentage:
        data.data.comparison.overall.change_percentage,
      totalConversions: data.data.overall_stats.total_conversions,
      topClicksCount: data.data.overall_stats.total_clicks,
    };
  }, [data]);

  // Fetch conversion rate data
  const fetchConversionRate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getConversionRate(memoizedParams);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch conversion rate data")
      );
      console.error("Failed to fetch conversion rate data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when parameters change
  useEffect(() => {
    fetchConversionRate();
  }, [memoizedParams]);

  // Manual refresh function
  const refreshConversionRate = () => {
    fetchConversionRate();
  };

  return {
    data,
    conversionStats,
    isLoading,
    error,
    refreshConversionRate,
  };
};
