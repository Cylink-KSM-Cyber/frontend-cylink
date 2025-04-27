import { useState, useEffect } from "react";
import { get } from "@/services/api";

/**
 * CTR Stats API Response Interface
 */
export interface CtrStatsResponse {
  status: number;
  message: string;
  data: {
    overall: {
      total_impressions: string;
      total_clicks: string;
      ctr: string;
      unique_impressions: string;
      unique_ctr: string;
      analysis_period: {
        start_date: string;
        end_date: string;
        days: number;
      };
    };
    top_performing_days: Array<{
      date: string;
      impressions: string;
      clicks: string;
      ctr: string;
    }>;
    ctr_by_source: Array<{
      source: string;
      impressions: string;
      clicks: string;
      ctr: string;
    }>;
  };
}

/**
 * CTR Stats Parameters Interface
 */
export interface CtrStatsParams {
  period?: string;
}

/**
 * Custom hook for fetching and managing CTR statistics
 * @param params - Optional parameters for the CTR stats API
 * @returns Object containing CTR stats data, loading state, error state, and refresh function
 */
export const useCtrStats = (params?: CtrStatsParams) => {
  const [ctrStats, setCtrStats] = useState<CtrStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch CTR stats from API
  const fetchCtrStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params if provided
      const queryParams = params?.period ? `?period=${params.period}` : "";

      // Fetch data from API
      const response = await get<CtrStatsResponse>(
        `/api/v1/ctr/stats${queryParams}`
      );
      setCtrStats(response);
    } catch (err) {
      console.error("Error fetching CTR stats:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch CTR stats")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load and when params change
  useEffect(() => {
    fetchCtrStats();
  }, [params?.period]);

  // Manual refresh function
  const refreshCtrStats = () => {
    fetchCtrStats();
  };

  return {
    ctrStats,
    isLoading,
    error,
    refreshCtrStats,
  };
};
