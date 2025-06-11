/**
 * Dashboard Analytics Interfaces
 */

import { Url } from "./url";
import { IconType } from "react-icons";
import { UrlAnalyticsData } from "@/interfaces/urlAnalytics";

/**
 * Time Period Type
 * @description Possible time periods for dashboard data
 */
export type TimePeriod = "7" | "14" | "30" | "90" | "custom";

/**
 * Period Details Interface for comparison data
 */
export interface PeriodComparisonDetails {
  current: number;
  previous: number;
  change: number;
  periodDays: number;
  dateRange: string;
}

/**
 * KPI Card Data Interface
 * @description Data structure for a KPI card
 */
export interface KpiCardData {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: IconType;
  isLoading: boolean;
  isError: boolean;
  periodDetails?: {
    current: number;
    previous: number;
    change: number;
    periodDays: number;
    dateRange?: string;
  };
}

/**
 * Chart Data Point Interface
 */
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

/**
 * URL Performance Data Interface
 */
export interface UrlPerformanceData {
  timeSeriesData: ChartDataPoint[];
  topPerformingUrls: Url[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

/**
 * CTR Source Data Interface
 */
export interface CtrSourceData {
  source: string;
  ctr: number;
  clicks: number;
  impressions: number;
}

/**
 * CTR Breakdown Data Interface
 */
export interface CtrBreakdownData {
  sourceData: CtrSourceData[];
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

/**
 * Recent Activity Item Interface
 * @description Structure for a recent activity item
 */
export interface RecentActivityItem {
  id: number;
  type: "url_created" | "url_clicked" | "qr_generated";
  timestamp: string;
  description: string;
  url: Url;
  metadata?: {
    clicks?: number;
    qr_downloads?: number;
  };
}

/**
 * Top Performer Analytics Interface
 * @description Structure for detailed analytics of the top performing URL
 */
export interface TopPerformerAnalytics {
  urlId: number;
  shortCode: string;
  totalClicks: number;
  uniqueVisitors: number;
  clicksComparison: {
    current: number;
    previous: number;
    change: number;
    changePercentage: number;
    periodDays?: number;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  browserStats?: { [key: string]: number };
  deviceStats?: { [key: string]: number };
  countryStats?: { [key: string]: number };
  topReferrers?: Array<{ referrer: string; count: number }>;
}

/**
 * Dashboard Analytics Data Interface
 * @description Structure of all data required for the dashboard
 */
export interface DashboardAnalyticsData {
  kpiData: {
    totalUrls: KpiCardData;
    totalClicks: KpiCardData;
    averageCtr: KpiCardData;
    topPerformer: KpiCardData;
  };
  urlPerformance: {
    timeSeriesData: Array<{ date: string; value: number; label: string }>;
    topPerformingUrls: Array<Url>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
  ctrBreakdown: {
    sourceData: Array<{
      source: string;
      ctr: number;
      clicks: number;
      impressions: number;
    }>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
  recentActivity: {
    items: RecentActivityItem[];
    isLoading: boolean;
    isError: boolean;
  };
  timePeriod: TimePeriod;
  refresh: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  topPerformerAnalytics?: TopPerformerAnalytics;
  urlAnalytics?: UrlAnalyticsData;
}
