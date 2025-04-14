import { useState, useEffect } from "react";
import {
  AnalyticsData,
  TimeSeriesData,
  CategoryData,
  GeoData,
  ReferrerData,
  HourlyData,
} from "@/interfaces/url";

/**
 * Custom hook for fetching and managing analytics data
 * @param urlId - Optional URL ID to filter analytics for a specific URL
 * @returns Analytics data and loading state
 */
export const useAnalytics = (urlId?: string) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    end: new Date().toISOString(), // today
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This will be replaced with actual API call when integrated
        // For now, return mock data that matches the interface

        // Generate time series data for clicks over time (last 30 days)
        const clicksOverTime: TimeSeriesData[] = [];
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 30);

        for (
          let d = new Date(startDate);
          d <= endDate;
          d.setDate(d.getDate() + 1)
        ) {
          clicksOverTime.push({
            date: new Date(d).toISOString().split("T")[0],
            clicks: Math.floor(Math.random() * 50) + 10,
          });
        }

        // Generate device breakdown data
        const deviceBreakdown: CategoryData[] = [
          { name: "Mobile", value: 487, percentage: 56.3 },
          { name: "Desktop", value: 286, percentage: 33.1 },
          { name: "Tablet", value: 78, percentage: 9.0 },
          { name: "Other", value: 14, percentage: 1.6 },
        ];

        // Generate browser stats data
        const browserStats: CategoryData[] = [
          { name: "Chrome", value: 423, percentage: 48.9 },
          { name: "Safari", value: 215, percentage: 24.9 },
          { name: "Firefox", value: 98, percentage: 11.3 },
          { name: "Edge", value: 86, percentage: 9.9 },
          { name: "Other", value: 43, percentage: 5.0 },
        ];

        // Generate geo distribution data
        const geoDistribution: GeoData[] = [
          { country: "United States", clicks: 325, percentage: 37.6 },
          { country: "United Kingdom", clicks: 192, percentage: 22.2 },
          { country: "Germany", clicks: 148, percentage: 17.1 },
          { country: "France", clicks: 97, percentage: 11.2 },
          { country: "Canada", clicks: 68, percentage: 7.9 },
          { country: "Other", clicks: 35, percentage: 4.0 },
        ];

        // Generate referrer data
        const referrers: ReferrerData[] = [
          { source: "Direct", clicks: 356, percentage: 41.2 },
          { source: "Google", clicks: 247, percentage: 28.5 },
          { source: "Twitter", clicks: 124, percentage: 14.3 },
          { source: "Facebook", clicks: 86, percentage: 9.9 },
          { source: "LinkedIn", clicks: 38, percentage: 4.4 },
          { source: "Other", clicks: 14, percentage: 1.7 },
        ];

        // Generate time of day data
        const timeOfDayData: HourlyData[] = Array(24)
          .fill(null)
          .map((_, index) => ({
            hour: index,
            clicks:
              Math.floor(Math.random() * 40) +
              (index >= 9 && index <= 18 ? 30 : 5), // More clicks during business hours
          }));

        // Create the analytics data object
        const mockAnalytics: AnalyticsData = {
          clicksOverTime,
          deviceBreakdown,
          browserStats,
          geoDistribution,
          referrers,
          timeOfDayData,
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setAnalytics(mockAnalytics);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch analytics data")
        );
        console.error("Failed to fetch analytics data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlId, dateRange]);

  /**
   * Update date range for analytics
   * @param newDateRange - New date range for filtering analytics data
   */
  const updateDateRange = (newDateRange: { start: string; end: string }) => {
    setDateRange(newDateRange);
  };

  /**
   * Refresh analytics data
   */
  const refreshAnalytics = async () => {
    setIsLoading(true);

    try {
      // Same mock data generation as in the effect
      // In a real implementation, this would call the API again

      // Generate time series data for clicks over time (last 30 days)
      const clicksOverTime: TimeSeriesData[] = [];
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        clicksOverTime.push({
          date: new Date(d).toISOString().split("T")[0],
          clicks: Math.floor(Math.random() * 50) + 10,
        });
      }

      // Generate device breakdown data
      const deviceBreakdown: CategoryData[] = [
        { name: "Mobile", value: 487, percentage: 56.3 },
        { name: "Desktop", value: 286, percentage: 33.1 },
        { name: "Tablet", value: 78, percentage: 9.0 },
        { name: "Other", value: 14, percentage: 1.6 },
      ];

      // Generate browser stats data
      const browserStats: CategoryData[] = [
        { name: "Chrome", value: 423, percentage: 48.9 },
        { name: "Safari", value: 215, percentage: 24.9 },
        { name: "Firefox", value: 98, percentage: 11.3 },
        { name: "Edge", value: 86, percentage: 9.9 },
        { name: "Other", value: 43, percentage: 5.0 },
      ];

      // Generate geo distribution data
      const geoDistribution: GeoData[] = [
        { country: "United States", clicks: 325, percentage: 37.6 },
        { country: "United Kingdom", clicks: 192, percentage: 22.2 },
        { country: "Germany", clicks: 148, percentage: 17.1 },
        { country: "France", clicks: 97, percentage: 11.2 },
        { country: "Canada", clicks: 68, percentage: 7.9 },
        { country: "Other", clicks: 35, percentage: 4.0 },
      ];

      // Generate referrer data
      const referrers: ReferrerData[] = [
        { source: "Direct", clicks: 356, percentage: 41.2 },
        { source: "Google", clicks: 247, percentage: 28.5 },
        { source: "Twitter", clicks: 124, percentage: 14.3 },
        { source: "Facebook", clicks: 86, percentage: 9.9 },
        { source: "LinkedIn", clicks: 38, percentage: 4.4 },
        { source: "Other", clicks: 14, percentage: 1.7 },
      ];

      // Generate time of day data
      const timeOfDayData: HourlyData[] = Array(24)
        .fill(null)
        .map((_, index) => ({
          hour: index,
          clicks:
            Math.floor(Math.random() * 40) +
            (index >= 9 && index <= 18 ? 30 : 5), // More clicks during business hours
        }));

      // Create the analytics data object
      const mockAnalytics: AnalyticsData = {
        clicksOverTime,
        deviceBreakdown,
        browserStats,
        geoDistribution,
        referrers,
        timeOfDayData,
      };

      await new Promise((resolve) => setTimeout(resolve, 1200));
      setAnalytics(mockAnalytics);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh analytics data")
      );
      console.error("Failed to refresh analytics data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analytics,
    isLoading,
    error,
    dateRange,
    updateDateRange,
    refreshAnalytics,
  };
};
