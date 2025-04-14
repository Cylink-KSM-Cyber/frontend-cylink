import { useState, useEffect } from "react";
import { DashboardStats } from "@/interfaces/url";

/**
 * Custom hook for fetching and managing dashboard statistics
 * @returns Dashboard statistics and loading state
 */
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This will be replaced with actual API call when integrated
        // For now, return mock data that matches the interface
        const mockStats: DashboardStats = {
          totalUrls: 47,
          totalClicks: 1243,
          conversionRate: 3.2,
          qrCodesGenerated: 28,
          activeUrls: 35,
          urlsCreatedToday: 3,
          averageClicksPerUrl: 26.4,
          mostClickedUrl: {
            id: "1",
            originalUrl:
              "https://example.com/very/long/url/that/needs/shortening",
            shortUrl: "cylink.co/abc123",
            createdAt: new Date(
              Date.now() - 1000 * 60 * 60 * 24 * 7
            ).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            clicks: 156,
            status: "active",
            userId: "user1",
            clickTrend: 12.5,
          },
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
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

    fetchStats();
  }, []);

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
        totalUrls: 47,
        totalClicks: 1243,
        conversionRate: 3.2,
        qrCodesGenerated: 28,
        activeUrls: 35,
        urlsCreatedToday: 3,
        averageClicksPerUrl: 26.4,
        mostClickedUrl: {
          id: "1",
          originalUrl:
            "https://example.com/very/long/url/that/needs/shortening",
          shortUrl: "cylink.co/abc123",
          createdAt: new Date(
            Date.now() - 1000 * 60 * 60 * 24 * 7
          ).toISOString(),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          clicks: 156,
          status: "active",
          userId: "user1",
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

  return { stats, isLoading, error, refreshStats };
};
