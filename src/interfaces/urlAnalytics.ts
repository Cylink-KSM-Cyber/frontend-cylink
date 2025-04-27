/**
 * URL Analytics Request Parameters Interface
 * @description Parameters for fetching URL analytics data
 */
export interface UrlAnalyticsParams {
  start_date?: string;
  end_date?: string;
  group_by?: "day" | "week" | "month";
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
  top_referrers: ReferrerStats[];
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
