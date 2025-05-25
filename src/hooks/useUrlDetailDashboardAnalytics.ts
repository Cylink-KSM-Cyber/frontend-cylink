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
 * Custom hook for handling dashboard analytics data for a specific URL
 * Aggregates data from multiple API endpoints into a unified dashboard data structure
 *
 * @param urlId - The ID of the URL to get analytics for
 * @returns Dashboard analytics data and controls
 */
export const useUrlDetailDashboardAnalytics = (
  urlId?: number
): DashboardAnalyticsData => {
  // State for time period selection
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30");

  // Fetch URL-specific analytics
  const {
    analyticsData: urlAnalytics,
    isLoading: isUrlAnalyticsLoading,
    error: urlAnalyticsError,
    refetch: refetchUrlAnalytics,
  } = useUrlAnalytics({
    urlId,
    enableLazyLoading: false,
  });

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

  // Process URL analytics data to create the comparison data
  const processedUrlAnalytics = useMemo(() => {
    if (!urlAnalytics || !urlId) {
      return undefined;
    }

    // Use actual analytics data if available, with transformation for compatibility
    const clicksComparison = urlAnalytics.historical_analysis?.summary
      ?.comparison?.total_clicks
      ? {
          current: Number(
            urlAnalytics.historical_analysis.summary.comparison.total_clicks
              .current
          ),
          previous: Number(
            urlAnalytics.historical_analysis.summary.comparison.total_clicks
              .previous
          ),
          change: Number(
            urlAnalytics.historical_analysis.summary.comparison.total_clicks
              .change
          ),
          changePercentage: Number(
            urlAnalytics.historical_analysis.summary.comparison.total_clicks
              .change_percentage
          ),
          periodDays:
            urlAnalytics.historical_analysis.summary.comparison.period_days,
        }
      : {
          current: urlAnalytics.total_clicks,
          previous: Math.round(urlAnalytics.total_clicks / 1.1), // Fallback if no comparison data
          change: Math.round(urlAnalytics.total_clicks * 0.1),
          changePercentage: 10.0, // Default 10% increase
          periodDays: 7, // Default 7 days
        };

    return {
      urlId: urlId,
      shortCode: urlAnalytics.short_code,
      totalClicks: urlAnalytics.total_clicks,
      uniqueVisitors: urlAnalytics.unique_visitors,
      clicksComparison,
      isLoading: isUrlAnalyticsLoading,
      isError: !!urlAnalyticsError,
      error: urlAnalyticsError,
      browserStats: urlAnalytics.browser_stats,
      deviceStats: urlAnalytics.device_stats,
      countryStats: urlAnalytics.country_stats,
      topReferrers: urlAnalytics.top_referrers,
    };
  }, [urlAnalytics, urlId, isUrlAnalyticsLoading, urlAnalyticsError]);

  // Update the topPerformer KPI data with enhanced analytics
  const topPerformerKpi = useMemo(() => {
    // If we have a specific URL, use its data
    if (urlId && processedUrlAnalytics) {
      const trendValue =
        processedUrlAnalytics?.clicksComparison?.changePercentage ?? 0;
      const trendLabel = processedUrlAnalytics?.clicksComparison
        ? `${trendValue >= 0 ? "+" : ""}${trendValue.toFixed(
            1
          )}% vs previous period`
        : "total clicks";

      return {
        title: "URL Performance",
        value: processedUrlAnalytics.shortCode || "N/A",
        trend:
          Number(processedUrlAnalytics?.clicksComparison?.change) ||
          processedUrlAnalytics.totalClicks,
        trendLabel,
        icon: RiLineChartLine,
        isLoading: isUrlAnalyticsLoading,
        isError: !!urlAnalyticsError,
      };
    }

    // Otherwise, use the top URL from the list
    const trendValue =
      processedUrlAnalytics?.clicksComparison?.changePercentage ?? 0;
    const trendLabel = processedUrlAnalytics?.clicksComparison
      ? `${trendValue >= 0 ? "+" : ""}${trendValue.toFixed(
          1
        )}% vs previous period`
      : "total clicks";

    return {
      title: "Top Performing URL",
      value: topUrls.length > 0 ? topUrls[0].short_url || "N/A" : "N/A",
      trend:
        processedUrlAnalytics?.clicksComparison?.change ??
        (topUrls.length > 0 ? topUrls[0].clicks : 0),
      trendLabel,
      icon: RiLineChartLine,
      isLoading: isTopUrlsLoading || isUrlAnalyticsLoading,
      isError: !!topUrlsError || !!urlAnalyticsError,
    };
  }, [
    urlId,
    topUrls,
    isTopUrlsLoading,
    topUrlsError,
    processedUrlAnalytics,
    isUrlAnalyticsLoading,
    urlAnalyticsError,
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

  // Generate time series data from the API response - use URL specific if available
  const generateTimeSeriesData = useCallback(() => {
    // If we have URL specific analytics, use its time series data
    if (urlAnalytics?.historical_analysis?.time_series?.data) {
      return urlAnalytics.historical_analysis.time_series.data.map((item) => ({
        date: item.date,
        value: item.clicks,
        label: `${item.clicks} clicks`,
      }));
    }

    // Otherwise, use the overall time series data
    if (!totalClicksData?.time_series?.data) {
      return [];
    }

    return totalClicksData.time_series.data.map((item) => ({
      date: item.date,
      value: item.clicks,
      label: `${item.clicks} clicks`,
    }));
  }, [totalClicksData, urlAnalytics]);

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
    // Refresh URL analytics if available
    if (refetchUrlAnalytics) {
      await refetchUrlAnalytics();
    }

    // Return resolved promise for other refreshes
    return Promise.resolve();
  }, [refetchUrlAnalytics]);

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
        title: urlId ? "URL Clicks" : "Total Clicks",
        value:
          urlId && urlAnalytics
            ? urlAnalytics.total_clicks
            : totalClicksData?.summary?.total_clicks || 0,
        trend:
          totalClicksData?.summary?.comparison?.total_clicks
            ?.change_percentage || 0,
        trendLabel: totalClicksData?.summary?.comparison?.period_days
          ? `vs previous ${totalClicksData.summary.comparison.period_days} days`
          : "vs previous period",
        icon: RiBarChartLine,
        isLoading: isClicksLoading || (urlId ? isUrlAnalyticsLoading : false),
        isError: !!clicksError || (urlId ? !!urlAnalyticsError : false),
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
        title: urlId ? "URL CTR" : "Average CTR",
        value:
          urlId && urlAnalytics?.ctr_statistics?.overall
            ? `${parseFloat(urlAnalytics.ctr_statistics.overall.ctr).toFixed(
                2
              )}%`
            : ctrStats?.data?.overall
            ? `${parseFloat(ctrStats.data.overall.ctr).toFixed(2)}%`
            : "0%",
        trend:
          urlId && urlAnalytics?.ctr_statistics?.comparison
            ? urlAnalytics.ctr_statistics.comparison.metrics?.ctr
                ?.change_percentage || 0
            : ctrStats?.data?.comparison
            ? ctrStats.data.comparison.metrics?.ctr?.change_percentage || 0
            : 0,
        trendLabel:
          urlId && urlAnalytics?.ctr_statistics?.comparison?.period_days
            ? `vs previous ${urlAnalytics.ctr_statistics.comparison.period_days} days`
            : ctrStats?.data?.comparison?.period_days
            ? `vs previous ${ctrStats.data.comparison.period_days} days`
            : "vs previous period",
        icon: RiPercentLine,
        isLoading: isCtrLoading || (urlId ? isUrlAnalyticsLoading : false),
        isError: !!ctrError || (urlId ? !!urlAnalyticsError : false),
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
      isLoading: isClicksLoading || isTopUrlsLoading || isUrlAnalyticsLoading,
      isError: !!clicksError || !!topUrlsError || !!urlAnalyticsError,
      error: clicksError || topUrlsError || urlAnalyticsError || null,
    },
    ctrBreakdown: {
      sourceData: generateCtrBreakdown(),
      isLoading: isCtrLoading || isUrlAnalyticsLoading,
      isError: !!ctrError || !!urlAnalyticsError,
      error: ctrError || urlAnalyticsError || null,
    },
    recentActivity,
    timePeriod,
    refresh: refreshData,
    setTimePeriod,
    topPerformerAnalytics: processedUrlAnalytics,
    urlAnalytics: urlAnalytics || undefined,
  };
};
