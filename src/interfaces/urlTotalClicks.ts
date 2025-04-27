/**
 * URL Total Clicks Interfaces
 * @description TypeScript interfaces for URL total clicks analytics data
 */

/**
 * URL Total Clicks Request Parameters
 */
export interface UrlTotalClicksParams {
  start_date?: string;
  end_date?: string;
  comparison?: "7" | "14" | "30" | "90" | "custom";
  custom_comparison_start?: string;
  custom_comparison_end?: string;
  group_by?: "day" | "week" | "month";
  page?: number;
  limit?: number;
}

/**
 * Analysis Period Interface
 */
export interface AnalysisPeriod {
  start_date: string;
  end_date: string;
  days: number;
}

/**
 * Comparison Period Interface
 */
export interface ComparisonPeriod {
  start_date: string;
  end_date: string;
}

/**
 * Metric Comparison Interface
 */
export interface MetricComparison {
  current: number;
  previous: number;
  change: number;
  change_percentage: number;
}

/**
 * URL Total Clicks Summary Interface
 */
export interface UrlTotalClicksSummary {
  total_clicks: number;
  total_urls: number;
  avg_clicks_per_url: number;
  analysis_period: AnalysisPeriod;
  comparison: {
    period_days: number;
    previous_period: ComparisonPeriod;
    total_clicks: MetricComparison;
    avg_clicks_per_url: MetricComparison;
    active_urls: MetricComparison;
  };
}

/**
 * Time Series Data Point Interface
 */
export interface UrlClicksTimeSeriesDataPoint {
  date: string;
  clicks: number;
  urls_count: number;
  avg_clicks: number;
}

/**
 * Pagination Interface
 */
export interface Pagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

/**
 * URL Total Clicks Time Series Interface
 */
export interface UrlTotalClicksTimeSeries {
  data: UrlClicksTimeSeriesDataPoint[];
  pagination: Pagination;
}

/**
 * URL Total Clicks Data Interface
 */
export interface UrlTotalClicksData {
  summary: UrlTotalClicksSummary;
  time_series: UrlTotalClicksTimeSeries;
  top_performing_days: UrlClicksTimeSeriesDataPoint[];
}

/**
 * URL Total Clicks Response Interface
 */
export interface UrlTotalClicksResponse {
  status: number;
  message: string;
  data: UrlTotalClicksData;
}
