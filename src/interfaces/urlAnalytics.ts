/**
 * URL Analytics Request Parameters Interface
 * @description Parameters for fetching URL analytics data
 */
export interface UrlAnalyticsParams {
  start_date?: string;
  end_date?: string;
  group_by?: "day" | "week" | "month";
  comparison?: "7" | "14" | "30" | "90" | "custom";
  custom_comparison_start?: string;
  custom_comparison_end?: string;
  page?: number;
  limit?: number;
}

/**
 * Time Series Data Point Interface
 * @description Data point for time series analytics
 */
export interface TimeSeriesDataPoint {
  date: string;
  clicks: number;
}

/**
 * Referrer Stats Interface
 * @description Statistics for a referring source
 */
export interface ReferrerStats {
  referrer: string;
  count: number;
}

/**
 * Browser Stats Interface
 * @description Maps browser name to count
 */
export interface BrowserStats {
  [browser: string]: number;
}

/**
 * Device Stats Interface
 * @description Maps device type to count
 */
export interface DeviceStats {
  [device: string]: number;
}

/**
 * Country Stats Interface
 * @description Maps country name to count
 */
export interface CountryStats {
  [country: string]: number;
}

/**
 * Period Interface
 * @description Represents a time period with start and end dates
 */
export interface Period {
  start_date: string;
  end_date: string;
  days?: number;
}

/**
 * Metric Comparison Interface
 * @description Comparison data for a metric between two periods
 */
export interface MetricComparison {
  current: string | number;
  previous: string | number;
  change: string | number;
  change_percentage: number;
}

/**
 * Comparison Data Interface
 * @description Data for comparison between two periods
 */
export interface ComparisonData {
  period_days: number;
  previous_period: Period;
  total_clicks: MetricComparison;
}

/**
 * CTR Metrics Interface
 * @description Click-through rate metrics comparison
 */
export interface CtrMetrics {
  impressions: MetricComparison;
  clicks: MetricComparison;
  ctr: MetricComparison;
}

/**
 * CTR Comparison Interface
 * @description Comparison data for CTR metrics
 */
export interface CtrComparison {
  period_days: number;
  previous_period: Period;
  metrics: CtrMetrics;
}

/**
 * CTR Data Point Interface
 * @description Data point for CTR time series
 */
export interface CtrDataPoint {
  date: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

/**
 * CTR By Source Interface
 * @description CTR data for a specific traffic source
 */
export interface CtrBySource {
  source: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

/**
 * Overall CTR Stats Interface
 * @description Overall CTR statistics
 */
export interface OverallCtrStats {
  total_impressions: string;
  total_clicks: string;
  ctr: string;
  unique_impressions: string;
  unique_ctr: string;
}

/**
 * Pagination Interface
 * @description Pagination information
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

/**
 * Top Performing Day Interface
 * @description Data for a top performing day
 */
export interface TopPerformingDay {
  date: string;
  clicks: number;
}

/**
 * Top Performing CTR Day Interface
 * @description Data for a top performing day by CTR
 */
export interface TopPerformingCtrDay {
  date: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

/**
 * Historical Analysis Interface
 * @description Historical analysis data
 */
export interface HistoricalAnalysis {
  summary: {
    analysis_period: Period;
    comparison: ComparisonData;
  };
  time_series: {
    data: TimeSeriesDataPoint[];
    pagination: Pagination;
  };
  top_performing_days: TopPerformingDay[];
}

/**
 * CTR Statistics Interface
 * @description CTR statistics data
 */
export interface CtrStatistics {
  overall: OverallCtrStats;
  comparison: CtrComparison;
  time_series: {
    data: CtrDataPoint[];
  };
  top_performing_days: TopPerformingCtrDay[];
  ctr_by_source: CtrBySource[];
}

/**
 * URL Analytics Data Interface
 * @description Structure of the URL analytics data from API
 */
export interface UrlAnalyticsData {
  url_id: number;
  short_code: string;
  total_clicks: number;
  unique_visitors: number;
  time_series_data: TimeSeriesDataPoint[];
  browser_stats: BrowserStats;
  device_stats: DeviceStats;
  country_stats: CountryStats;
  top_referrers: ReferrerStats[];
  historical_analysis: HistoricalAnalysis;
  ctr_statistics: CtrStatistics;
}

/**
 * URL Analytics Response Interface
 * @description Structure of the API response for URL analytics
 */
export interface UrlAnalyticsResponse {
  status: number;
  message: string;
  data: UrlAnalyticsData;
}
