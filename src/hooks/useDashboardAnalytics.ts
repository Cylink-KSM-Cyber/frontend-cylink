import { useState, useEffect, useCallback } from "react";
import {
  DashboardAnalyticsData,
  TimePeriod,
  RecentActivityItem,
} from "@/interfaces/dashboard";
import { useTotalUrls } from "@/hooks/useTotalUrls";
import { useTotalClicks } from "@/hooks/useTotalClicks";
import { useConversionRate } from "@/hooks/useConversionRate";
import { useUrls } from "@/hooks/useUrls";
import { useCtrStats } from "@/hooks/useCtrStats";
import {
  RiLineChartLine,
  RiLinkM,
  RiPercentLine,
  RiBarChartLine,
} from "react-icons/ri";

/**
 * Map dashboard time period to conversion rate params
 * @param period Dashboard time period
 * @returns Time period value for conversion rate API
 */
const mapTimePeriodToConversionParams = (
  period: TimePeriod
): 7 | 14 | 30 | 90 | undefined => {
  if (period === "custom") return undefined;
  return parseInt(period, 10) as 7 | 14 | 30 | 90;
};

/**
 * Custom hook for handling dashboard analytics data
 * Aggregates data from multiple API endpoints into a unified dashboard data structure
 *
 * @returns Dashboard analytics data and controls
 */
export const useDashboardAnalytics = (): DashboardAnalyticsData => {
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30");

  // Call existing hooks with the selected time period
  const {
    totalUrls,
    isLoading: isUrlsLoading,
    error: urlsError,
  } = useTotalUrls();

  const {
    totalClicksData,
    isLoading: isClicksLoading,
    error: clicksError,
  } = useTotalClicks({ comparison: timePeriod });

  const conversionPeriod = mapTimePeriodToConversionParams(timePeriod);
  useConversionRate({
    comparison: conversionPeriod,
  });

  // Get CTR stats
  const {
    ctrStats,
    isLoading: isCtrStatsLoading,
    error: ctrStatsError,
  } = useCtrStats({
    period: timePeriod === "custom" ? undefined : timePeriod,
  });

  // Get top performing URLs (sorted by clicks)
  const {
    urls: topUrls,
    isLoading: isTopUrlsLoading,
    error: topUrlsError,
  } = useUrls({
    page: 1,
    limit: 5,
    sortBy: "clicks",
    sortOrder: "desc",
  });

  // Mocked recent activity for now (would be replaced with an API endpoint)
  const [recentActivity, setRecentActivity] = useState<{
    items: RecentActivityItem[];
    isLoading: boolean;
    isError: boolean;
  }>({
    items: [],
    isLoading: true,
    isError: false,
  });

  // Generate time series data from the API response
  const generateTimeSeriesData = useCallback(() => {
    if (!totalClicksData?.time_series?.data) {
      return [];
    }

    return totalClicksData.time_series.data.map((item) => ({
      date: item.date,
      value: item.clicks,
      label: `${item.clicks} clicks`,
    }));
  }, [totalClicksData]);

  // Generate CTR breakdown data from API response
  const generateCtrBreakdown = useCallback(() => {
    if (!ctrStats?.data?.ctr_by_source) {
      return [];
    }

    return ctrStats.data.ctr_by_source
      .filter(
        (item: { impressions: string; clicks: string }) =>
          parseInt(item.impressions, 10) > 0 || parseInt(item.clicks, 10) > 0
      )
      .map(
        (item: {
          source: string;
          ctr: string;
          clicks: string;
          impressions: string;
        }) => ({
          source: item.source,
          ctr: parseFloat(item.ctr),
          clicks: parseInt(item.clicks, 10),
          impressions: parseInt(item.impressions, 10),
        })
      )
      .sort((a: { ctr: number }, b: { ctr: number }) => b.ctr - a.ctr)
      .slice(0, 5);
  }, [ctrStats]);

  // Mock recent activity data
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchRecentActivity = async () => {
      setRecentActivity((prev) => ({ ...prev, isLoading: true }));

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate mock recent activity based on available URLs
        const mockActivities: RecentActivityItem[] = topUrls
          .slice(0, 5)
          .map((url, index) => ({
            id: index + 1,
            type:
              index % 3 === 0
                ? "url_created"
                : index % 3 === 1
                ? "url_clicked"
                : "qr_generated",
            timestamp: new Date(Date.now() - index * 3600000).toISOString(),
            description:
              index % 3 === 0
                ? `URL ${url.short_url} was created`
                : index % 3 === 1
                ? `URL ${url.short_url} was clicked ${
                    Math.floor(Math.random() * 10) + 1
                  } times`
                : `QR code was generated for ${url.short_url}`,
            url: url,
            metadata: {
              clicks: url.clicks,
            },
          }));

        setRecentActivity({
          items: mockActivities,
          isLoading: false,
          isError: false,
        });
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        setRecentActivity({
          items: [],
          isLoading: false,
          isError: true,
        });
      }
    };

    if (!isTopUrlsLoading && topUrls.length > 0) {
      fetchRecentActivity();
    }
  }, [isTopUrlsLoading, topUrls]);

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    // This would typically call refresh methods on individual hooks
    // For now we'll just return a resolved promise
    return Promise.resolve();
  }, []);

  return {
    kpiData: {
      totalUrls: {
        title: "Total URLs",
        value: totalUrls || 0,
        trend:
          totalClicksData?.summary?.comparison?.active_urls
            ?.change_percentage || 0,
        trendLabel: "vs previous period",
        icon: RiLinkM,
        isLoading: isUrlsLoading,
        isError: !!urlsError,
      },
      totalClicks: {
        title: "Total Clicks",
        value: totalClicksData?.summary?.total_clicks || 0,
        trend:
          totalClicksData?.summary?.comparison?.total_clicks
            ?.change_percentage || 0,
        trendLabel: "vs previous period",
        icon: RiBarChartLine,
        isLoading: isClicksLoading,
        isError: !!clicksError,
      },
      averageCtr: {
        title: "Average CTR",
        value: ctrStats?.data?.overall
          ? `${parseFloat(ctrStats.data.overall.ctr).toFixed(2)}%`
          : "0%",
        trend: 0, // This would need a comparison period calculation from the API
        trendLabel: "vs previous period",
        icon: RiPercentLine,
        isLoading: isCtrStatsLoading,
        isError: !!ctrStatsError,
      },
      topPerformer: {
        title: "Top Performing URL",
        value: topUrls.length > 0 ? topUrls[0].short_url : "N/A",
        trend: topUrls.length > 0 ? topUrls[0].clicks : 0,
        trendLabel: "total clicks",
        icon: RiLineChartLine,
        isLoading: isTopUrlsLoading,
        isError: !!topUrlsError,
      },
    },
    urlPerformance: {
      timeSeriesData: generateTimeSeriesData(),
      topPerformingUrls: topUrls,
      isLoading: isClicksLoading || isTopUrlsLoading,
      isError: !!clicksError || !!topUrlsError,
      error: clicksError || topUrlsError || null,
    },
    ctrBreakdown: {
      sourceData: generateCtrBreakdown(),
      isLoading: isCtrStatsLoading,
      isError: !!ctrStatsError,
      error: ctrStatsError || null,
    },
    recentActivity,
    timePeriod,
    refresh: refreshData,
    setTimePeriod,
  };
};
