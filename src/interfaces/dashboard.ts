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
}
