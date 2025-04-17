import { useState, useEffect } from "react";
import { DashboardStats } from "@/interfaces/url";
import { useTotalUrls } from "@/hooks/useTotalUrls";

/**
 * Custom hook for fetching and managing dashboard statistics
 * @returns Dashboard statistics and loading state
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Use the totalUrls hook to get real total URLs count from API
  const {
    totalUrls,
    isLoading: isTotalUrlsLoading,
    error: totalUrlsError,
  } = useTotalUrls();

  // Log the value of totalUrls for debugging
  useEffect(() => {
    console.log("Current totalUrls value in useDashboardStats:", totalUrls);
  }, [totalUrls]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This will be replaced with actual API call when integrated
        // For now, return mock data that matches the interface
        console.log("Creating mockStats with totalUrls:", totalUrls);
        const mockStats: DashboardStats = {
          // Use the real totalUrls from API
          totalUrls: totalUrls,
          totalClicks: 1243,
          conversionRate: 3.2,
          qrCodesGenerated: 28,
          activeUrls: 35,
          urlsCreatedToday: 3,
          averageClicksPerUrl: 26.4,
          mostClickedUrl: {
            id: 1,
            original_url:
              "https://example.com/very/long/url/that/needs/shortening",
            short_code: "abc123",
            short_url: "cylink.co/abc123",
            created_at: new Date(
              Date.now() - 1000 * 60 * 60 * 24 * 7
            ).toISOString(),
            updated_at: new Date(
              Date.now() - 1000 * 60 * 60 * 12
            ).toISOString(),
            clicks: 156,
            is_active: true,
            user_id: 1,
            clickTrend: 12.5,
          },
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("Setting stats with totalUrls:", mockStats.totalUrls);
        setStats(mockStats);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch dashboard stats")
        );
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch stats when totalUrls is loaded
    if (!isTotalUrlsLoading) {
      console.log("totalUrls loaded, fetching stats with value:", totalUrls);
      fetchStats();
    }
  }, [totalUrls, isTotalUrlsLoading]);

  /**
   * Refresh dashboard statistics
   * @returns Promise that resolves when refresh is complete
   */
  const refreshStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This will be replaced with actual API call
      const mockStats: DashboardStats = {
        // Use the real totalUrls from API
        totalUrls: totalUrls,
        totalClicks: 1243,
        conversionRate: 3.2,
        qrCodesGenerated: 28,
        activeUrls: 35,
        urlsCreatedToday: 3,
        averageClicksPerUrl: 26.4,
        mostClickedUrl: {
          id: 1,
          original_url:
            "https://example.com/very/long/url/that/needs/shortening",
          short_code: "abc123",
          short_url: "cylink.co/abc123",
          created_at: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 7
          ).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          clicks: 156,
          is_active: true,
          user_id: 1,
          clickTrend: 12.5,
        },
      };

      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats(mockStats);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh dashboard stats")
      );
      console.error("Failed to refresh dashboard stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Combine errors from both hooks
  const combinedError = error || totalUrlsError;

  // Loading is true if either hook is loading
  const combinedIsLoading = isLoading || isTotalUrlsLoading;

  return {
    stats,
    isLoading: combinedIsLoading,
    error: combinedError,
    refreshStats,
  };
};
