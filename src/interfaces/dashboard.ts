/**
 * Dashboard Analytics Interfaces
 */

import { Url } from "./url";
import { IconType } from "react-icons";

/**
 * Time Period Selection Options
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
 */
export interface KpiCardData {
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  icon?: IconType;
  isLoading?: boolean;
  isError?: boolean;
  color?: string;
  periodDetails?: PeriodComparisonDetails;
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
 */
export interface RecentActivityItem {
  id: number;
  type: "url_created" | "url_clicked" | "qr_generated";
  timestamp: string;
  description: string;
  url?: Url;
  metadata?: Record<string, unknown>;
}

/**
 * Top Performer URL Analytics Interface
 * @description Contains detailed analytics for the top performing URL
 */
export interface TopPerformerAnalytics {
  urlId: number;
  shortCode: string;
  totalClicks: number;
  uniqueVisitors: number;
  clicksComparison?: {
    current: number;
    previous: number;
    change: number;
    changePercentage: number;
    periodDays?: number;
  };
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

/**
 * Dashboard Analytics Data Interface
 */
export interface DashboardAnalyticsData {
  kpiData: {
    totalUrls: KpiCardData;
    totalClicks: KpiCardData;
    averageCtr: KpiCardData;
    topPerformer: KpiCardData;
  };
  urlPerformance: UrlPerformanceData;
  ctrBreakdown: CtrBreakdownData;
  recentActivity: {
    items: RecentActivityItem[];
    isLoading: boolean;
    isError: boolean;
  };
  timePeriod: TimePeriod;
  refresh: () => Promise<void>;
  setTimePeriod: (period: TimePeriod) => void;
  topPerformerAnalytics?: TopPerformerAnalytics;
}
