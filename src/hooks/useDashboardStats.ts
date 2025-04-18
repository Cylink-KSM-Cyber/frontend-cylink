import { useState, useEffect, useMemo } from "react";
import { ExtendedDashboardStats } from "@/interfaces/url";
import { useTotalUrls } from "@/hooks/useTotalUrls";
import { useTotalClicks } from "@/hooks/useTotalClicks";

/**
 * Custom hook for fetching and managing dashboard statistics
 * @returns Dashboard statistics and loading state
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState<ExtendedDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [statsLoaded, setStatsLoaded] = useState<boolean>(false);

  // Memoize the parameters to prevent unnecessary re-renders
  const totalClicksParams = useMemo(() => ({ comparison: "30" } as const), []);

  // Use the totalUrls hook to get real total URLs count from API
  const {
    totalUrls,
    isLoading: isTotalUrlsLoading,
    error: totalUrlsError,
  } = useTotalUrls();

  // Use the totalClicks hook to get real total clicks data from API
  const {
    totalClicksData,
    isLoading: isTotalClicksLoading,
    error: totalClicksError,
  } = useTotalClicks(totalClicksParams);

  // Log the value of totalUrls for debugging
  useEffect(() => {
    if (totalUrls !== undefined && process.env.NODE_ENV === "development") {
      console.log("Current totalUrls value in useDashboardStats:", totalUrls);
    }
  }, [totalUrls]);

  // Log the value of totalClicksData for debugging
  useEffect(() => {
    if (totalClicksData && process.env.NODE_ENV === "development") {
      console.log(
        "Current totalClicksData in useDashboardStats:",
        totalClicksData
      );
    }
  }, [totalClicksData]);

  useEffect(() => {
    // Skip if we've already loaded stats and data hasn't changed
    if (statsLoaded && stats && !isLoading) {
      if (process.env.NODE_ENV === "development") {
        console.log("Skipping fetchStats as stats are already loaded");
      }
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create stats data using actual API responses
        console.log(
          "Creating stats with totalUrls:",
          totalUrls,
          "and totalClicksData:",
          totalClicksData
        );

        // Log specific values we're interested in
        if (totalClicksData?.summary) {
          console.log(
            "API response - total_clicks:",
            totalClicksData.summary.total_clicks,
            "type:",
            typeof totalClicksData.summary.total_clicks
          );
          console.log(
            "API response - avg_clicks_per_url:",
            totalClicksData.summary.avg_clicks_per_url,
            "type:",
            typeof totalClicksData.summary.avg_clicks_per_url
          );
          console.log(
            "API response - change_percentage:",
            totalClicksData.summary.comparison?.total_clicks?.change_percentage,
            "type:",
            typeof totalClicksData.summary.comparison?.total_clicks
              ?.change_percentage
          );
        }

        const mockStats: ExtendedDashboardStats = {
          // Use the real totalUrls from API
          totalUrls: totalUrls,

          // Use real total clicks data from API if available, otherwise use mock data
          totalClicks: totalClicksData?.summary?.total_clicks ?? 1243,

          conversionRate: 3.2,
          qrCodesGenerated: 28,
          activeUrls:
            totalClicksData?.summary?.comparison?.active_urls?.current ?? 35,
          urlsCreatedToday: 3,

          // Use real average clicks data from API if available, otherwise use mock data
          averageClicksPerUrl:
            totalClicksData?.summary?.avg_clicks_per_url ?? 26.4,

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

          // Add the extended total clicks data if available
          totalClicksData: totalClicksData?.summary
            ? {
                avg_clicks_per_url:
                  parseFloat(
                    String(totalClicksData.summary.avg_clicks_per_url)
                  ) || 0,
                change_percentage:
                  totalClicksData.summary.comparison?.total_clicks
                    ?.change_percentage ?? 0,
              }
            : undefined,
        };

        console.log("Final stats object:", {
          totalClicks: mockStats.totalClicks,
          type: typeof mockStats.totalClicks,
          avgClicksPerUrl: mockStats.averageClicksPerUrl,
          type2: typeof mockStats.averageClicksPerUrl,
          totalClicksData: mockStats.totalClicksData,
        });

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log(
          "Setting stats with totalUrls:",
          mockStats.totalUrls,
          "and totalClicks:",
          mockStats.totalClicks
        );
        setStats(mockStats);
        setStatsLoaded(true);
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

    // Only fetch stats when both totalUrls and totalClicksData are loaded
    if (
      !isTotalUrlsLoading &&
      !isTotalClicksLoading &&
      (totalUrls !== undefined || totalClicksData !== null)
    ) {
      console.log(
        "totalUrls and totalClicksData loaded, fetching stats with values:",
        totalUrls,
        totalClicksData
      );
      fetchStats();
    }
  }, [
    totalUrls,
    isTotalUrlsLoading,
    totalClicksData,
    isTotalClicksLoading,
    stats,
    isLoading,
    statsLoaded,
  ]);

  /**
   * Refresh dashboard statistics
   * @returns Promise that resolves when refresh is complete
   */
  const refreshStats = async () => {
    setStatsLoaded(false); // Force a refresh by setting statsLoaded to false
    setIsLoading(true);
    setError(null);

    try {
      // Create stats using actual API data
      const refreshedStats: ExtendedDashboardStats = {
        // Use the real totalUrls from API
        totalUrls: totalUrls,

        // Use real total clicks data from API if available, otherwise use mock data
        totalClicks: totalClicksData?.summary?.total_clicks ?? 1243,

        conversionRate: 3.2,
        qrCodesGenerated: 28,
        activeUrls:
          totalClicksData?.summary?.comparison?.active_urls?.current ?? 35,
        urlsCreatedToday: 3,

        // Use real average clicks data from API if available, otherwise use mock data
        averageClicksPerUrl:
          totalClicksData?.summary?.avg_clicks_per_url ?? 26.4,

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

        // Add the extended total clicks data if available
        totalClicksData: totalClicksData?.summary
          ? {
              avg_clicks_per_url:
                parseFloat(
                  String(totalClicksData.summary.avg_clicks_per_url)
                ) || 0,
              change_percentage:
                totalClicksData.summary.comparison?.total_clicks
                  ?.change_percentage ?? 0,
            }
          : undefined,
      };

      console.log("refreshStats - Final stats object:", {
        totalClicks: refreshedStats.totalClicks,
        type: typeof refreshedStats.totalClicks,
        avgClicksPerUrl: refreshedStats.averageClicksPerUrl,
        type2: typeof refreshedStats.averageClicksPerUrl,
        totalClicksData: refreshedStats.totalClicksData,
      });

      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats(refreshedStats);
      setStatsLoaded(true);
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

  // Combine errors from hooks
  const combinedError = error || totalUrlsError || totalClicksError;

  // Loading is true if any hook is loading
  const combinedIsLoading =
    isLoading || isTotalUrlsLoading || isTotalClicksLoading;

  return {
    stats,
    isLoading: combinedIsLoading,
    error: combinedError,
    refreshStats,
  };
};
