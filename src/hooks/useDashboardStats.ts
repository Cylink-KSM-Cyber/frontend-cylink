import { useState, useEffect, useMemo } from "react";
import { ExtendedDashboardStats } from "@/interfaces/url";
import { useTotalUrls } from "@/hooks/useTotalUrls";
import { useTotalClicks } from "@/hooks/useTotalClicks";
import { useConversionRate } from "@/hooks/useConversionRate";
import { useQrCodeStats } from "@/hooks/useQrCodeStats";

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
  const conversionRateParams = useMemo(() => ({ comparison: 30 } as const), []);

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

  // Use the conversionRate hook to get real conversion data from API
  const {
    conversionStats,
    isLoading: isConversionRateLoading,
    error: conversionRateError,
  } = useConversionRate(conversionRateParams);

  // Use the QR code stats hook to get real QR code data from API
  const {
    stats: qrCodeStats,
    isLoading: isQrCodeStatsLoading,
    error: qrCodeStatsError,
  } = useQrCodeStats();

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

  // Log the value of conversionStats for debugging
  useEffect(() => {
    if (conversionStats && process.env.NODE_ENV === "development") {
      console.log(
        "Current conversionStats in useDashboardStats:",
        conversionStats
      );
    }
  }, [conversionStats]);

  // Log the value of qrCodeStats for debugging
  useEffect(() => {
    if (qrCodeStats && process.env.NODE_ENV === "development") {
      console.log("Current qrCodeStats in useDashboardStats:", qrCodeStats);
    }
  }, [qrCodeStats]);

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
          "totalClicksData:",
          totalClicksData,
          "and conversionStats:",
          conversionStats,
          "and qrCodeStats:",
          qrCodeStats
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

          // Use conversion rate from API if available or fall back to mock data
          conversionRate: conversionStats?.conversionRate ?? 3.2,

          // Use real QR code stats from API if available, otherwise use mock data
          qrCodesGenerated: qrCodeStats.total ?? 28,
          activeUrls:
            totalClicksData?.summary?.comparison?.active_urls?.current ?? 35,

          // Use real QR codes created today from API if available, otherwise use mock data
          urlsCreatedToday: 3,
          qrCodesCreatedToday: qrCodeStats.createdToday ?? 0,

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
            clicks: conversionStats?.topClicksCount ?? 156,
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

          // Add the conversion data if available
          conversionData: conversionStats
            ? {
                totalConversions: conversionStats.totalConversions,
                changePercentage: conversionStats.conversionChangePercentage,
                topClicksCount: conversionStats.topClicksCount,
              }
            : undefined,
        };

        console.log("Final stats object:", {
          totalClicks: mockStats.totalClicks,
          type: typeof mockStats.totalClicks,
          avgClicksPerUrl: mockStats.averageClicksPerUrl,
          type2: typeof mockStats.averageClicksPerUrl,
          totalClicksData: mockStats.totalClicksData,
          conversionData: mockStats.conversionData,
          qrCodesGenerated: mockStats.qrCodesGenerated,
          urlsCreatedToday: mockStats.urlsCreatedToday,
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

    // Only fetch stats when all data is loaded
    if (
      !isTotalUrlsLoading &&
      !isTotalClicksLoading &&
      !isConversionRateLoading &&
      !isQrCodeStatsLoading &&
      (totalUrls !== undefined ||
        totalClicksData !== null ||
        conversionStats !== null ||
        qrCodeStats !== null)
    ) {
      console.log(
        "All data loaded, fetching stats with values - totalUrls:",
        totalUrls,
        "totalClicksData:",
        totalClicksData,
        "conversionStats:",
        conversionStats,
        "qrCodeStats:",
        qrCodeStats
      );
      fetchStats();
    }
  }, [
    totalUrls,
    isTotalUrlsLoading,
    totalClicksData,
    isTotalClicksLoading,
    conversionStats,
    isConversionRateLoading,
    qrCodeStats,
    isQrCodeStatsLoading,
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
        totalUrls: totalUrls ?? 0,

        // Use real total clicks data from API if available
        totalClicks:
          totalClicksData?.summary?.total_clicks ?? stats?.totalClicks ?? 0,

        // Use conversion rate from API if available
        conversionRate:
          conversionStats?.conversionRate ?? stats?.conversionRate ?? 0,

        // Use real QR code stats from API if available
        qrCodesGenerated: qrCodeStats.total ?? stats?.qrCodesGenerated ?? 0,

        // Use real active URLs from API if available
        activeUrls:
          totalClicksData?.summary?.comparison?.active_urls?.current ??
          stats?.activeUrls ??
          0,

        // Use real QR codes created today from API if available
        urlsCreatedToday: 3,
        qrCodesCreatedToday:
          qrCodeStats.createdToday ?? stats?.qrCodesCreatedToday ?? 0,

        // Use real average clicks data from API if available
        averageClicksPerUrl:
          totalClicksData?.summary?.avg_clicks_per_url ??
          stats?.averageClicksPerUrl ??
          0,

        // Use existing most clicked URL data or create a placeholder
        mostClickedUrl: stats?.mostClickedUrl ?? {
          id: 1,
          original_url: "https://example.com",
          short_code: "demo123",
          short_url: "cylink.co/demo123",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          clicks: 0,
          is_active: true,
          user_id: 1,
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

        // Add the conversion data if available
        conversionData: conversionStats
          ? {
              totalConversions: conversionStats.totalConversions,
              changePercentage: conversionStats.conversionChangePercentage,
              topClicksCount: conversionStats.topClicksCount,
            }
          : undefined,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats(refreshedStats);
      setStatsLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to refresh stats")
      );
      console.error("Failed to refresh stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // If there are any errors, log them
  useEffect(() => {
    if (totalUrlsError) console.error("Total URLs error:", totalUrlsError);
    if (totalClicksError)
      console.error("Total Clicks error:", totalClicksError);
    if (conversionRateError)
      console.error("Conversion Rate error:", conversionRateError);
    if (qrCodeStatsError)
      console.error("QR Code Stats error:", qrCodeStatsError);
  }, [totalUrlsError, totalClicksError, conversionRateError, qrCodeStatsError]);

  return { stats, isLoading, error, refreshStats };
};
