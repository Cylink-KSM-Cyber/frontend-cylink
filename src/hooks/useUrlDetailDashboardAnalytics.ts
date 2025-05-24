import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DashboardAnalyticsData,
  TimePeriod,
  RecentActivityItem,
} from "@/interfaces/dashboard";
import { useTotalUrls } from "@/hooks/useTotalUrls";
import { useTotalClicks } from "@/hooks/useTotalClicks";
import { useUrls } from "@/hooks/useUrls";
import { useCtrStats } from "./useCtrStats";
import { useUrlAnalytics } from "@/hooks/useUrlAnalytics";
import {
  RiLineChartLine,
  RiLinkM,
  RiPercentLine,
  RiBarChartLine,
} from "react-icons/ri";

/**
 * Custom hook for handling dashboard analytics data
 * Aggregates data from multiple API endpoints into a unified dashboard data structure
 *
 * @returns Dashboard analytics data and controls
 */
export const useUrlDetailDashboardAnalytics = (urlId?: number): DashboardAnalyticsData => {
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

  // Get CTR stats
  const {
    ctrStats,
    isLoading: isCtrLoading,
    error: ctrError,
  } = useCtrStats({
    period: timePeriod === "custom" ? undefined : timePeriod,
    comparison: timePeriod === "custom" ? undefined : timePeriod,
  });

  // Debug log untuk memeriksa data CTR comparison
  useEffect(() => {
    console.log("CTR Stats Data:", ctrStats);
    console.log(
      "CTR Has Comparison:",
      ctrStats?.data?.comparison !== undefined
    );
  }, [ctrStats]);

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

  // Fetch analytics for top performing URL if available
  const UrlId = urlId || undefined;

  // Gunakan hook useUrlAnalytics yang sudah disederhanakan
  const {
    analyticsData: UrlAnalytics,
    isLoading: isUrlAnalyticsLoading,
    error: UrlAnalyticsError,
  } = useUrlAnalytics({
    urlId: UrlId,
  });

  // Process top URL analytics data to create the comparison data manually
  const processedUrlAnalytics = useMemo(() => {
    if (!UrlAnalytics || !UrlId) {
      return undefined;
    }

    // Hitung perubahan performa secara manual
    // Karena kita tidak mendapatkan data perbandingan langsung dari API,
    // buat perbandingan dengan presentase default 10%
    const clicksComparison = {
      current: UrlAnalytics.total_clicks,
      previous: Math.round(UrlAnalytics.total_clicks / 1.1), // Asumsi perubahan sebesar 10%
      change: Math.round(UrlAnalytics.total_clicks * 0.1),
      changePercentage: 10.0, // Default 10% peningkatan
      periodDays: 7, // Default 7 hari
    };

    return {
      urlId: UrlId,
      shortCode: UrlAnalytics.short_code,
      totalClicks: UrlAnalytics.total_clicks,
      uniqueVisitors: UrlAnalytics.unique_visitors,
      clicksComparison,
      isLoading: isUrlAnalyticsLoading,
      isError: !!UrlAnalyticsError,
      error: UrlAnalyticsError,
    };
  }, [
    UrlAnalytics,
    UrlId,
    isUrlAnalyticsLoading,
    UrlAnalyticsError,
  ]);

  // Update the topPerformer KPI data with enhanced analytics
  const topPerformerKpi = useMemo(() => {
    const trendValue =
      processedUrlAnalytics?.clicksComparison?.changePercentage ?? 0;
    const trendLabel = processedUrlAnalytics?.clicksComparison
      ? `${trendValue >= 0 ? "+" : ""}${trendValue.toFixed(
          1
        )}% vs previous period`
      : "total clicks";

    return {
      title: "Top Performing URL",
      value: topUrls.length > 0 ? topUrls[0].short_code || "N/A" : "N/A",
      trend:
        processedUrlAnalytics?.clicksComparison?.change ??
        (topUrls.length > 0 ? topUrls[0].clicks : 0),
      trendLabel,
      icon: RiLineChartLine,
      isLoading: isTopUrlsLoading || isUrlAnalyticsLoading,
      isError: !!topUrlsError || !!UrlAnalyticsError,
    };
  }, [
    topUrls,
    isTopUrlsLoading,
    topUrlsError,
    processedUrlAnalytics,
    isUrlAnalyticsLoading,
    UrlAnalyticsError,
  ]);

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
        trend: undefined,
        trendLabel: undefined,
        icon: RiLinkM,
        isLoading: isUrlsLoading,
        isError: !!urlsError,
        periodDetails: undefined,
      },
      totalClicks: {
        title: "Total Clicks",
        value: totalClicksData?.summary?.total_clicks || 0,
        trend:
          totalClicksData?.summary?.comparison?.total_clicks
            ?.change_percentage || 0,
        trendLabel: totalClicksData?.summary?.comparison?.period_days
          ? `vs previous ${totalClicksData.summary.comparison.period_days} days`
          : "vs previous period",
        icon: RiBarChartLine,
        isLoading: isClicksLoading,
        isError: !!clicksError,
        periodDetails: totalClicksData?.summary?.comparison
          ? {
              current: totalClicksData.summary.comparison.total_clicks.current,
              previous:
                totalClicksData.summary.comparison.total_clicks.previous,
              change: totalClicksData.summary.comparison.total_clicks.change,
              periodDays: totalClicksData.summary.comparison.period_days,
              dateRange: `${totalClicksData.summary.comparison.previous_period.start_date} - ${totalClicksData.summary.comparison.previous_period.end_date}`,
            }
          : undefined,
      },
      averageCtr: {
        title: "Average CTR",
        value: ctrStats?.data?.overall
          ? `${parseFloat(ctrStats.data.overall.ctr).toFixed(2)}%`
          : "0%",
        trend: ctrStats?.data?.comparison
          ? ctrStats.data.comparison.metrics?.ctr?.change_percentage || 0
          : 0,
        trendLabel: ctrStats?.data?.comparison?.period_days
          ? `vs previous ${ctrStats.data.comparison.period_days} days`
          : "vs previous period",
        icon: RiPercentLine,
        isLoading: isCtrLoading,
        isError: !!ctrError,
        periodDetails: ctrStats?.data?.comparison
          ? {
              current: parseFloat(ctrStats.data.overall.ctr),
              previous: parseFloat(
                ctrStats.data.comparison.metrics.ctr.previous
              ),
              change: ctrStats.data.comparison.metrics.ctr.change,
              periodDays: ctrStats.data.comparison.period_days,
              dateRange: `${ctrStats.data.comparison.previous_period.start_date} - ${ctrStats.data.comparison.previous_period.end_date}`,
            }
          : undefined,
      },
      topPerformer: topPerformerKpi,
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
      isLoading: isCtrLoading,
      isError: !!ctrError,
      error: ctrError || null,
    },
    recentActivity,
    timePeriod,
    refresh: refreshData,
    setTimePeriod,
    topPerformerAnalytics: processedUrlAnalytics,
  };
};
