/**
 * URL Interface
 * @description Defines the structure of a shortened URL entity
 */
export interface Url {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  title?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  expiry_date?: string;
  clicks: number;
  is_active: boolean;
  user_id: number;
  customDomain?: string;
  tags?: string[];
  clickTrend?: number; // Percentage change in clicks (e.g., +15%)
}

/**
 * QR Code Interface
 * @description Defines the structure of a QR code entity
 */
export interface QrCode {
  id: number;
  urlId: number;
  shortCode?: string;
  shortUrl?: string;
  imageUrl: string | undefined;
  pngUrl?: string;
  svgUrl?: string;
  createdAt: string;
  updatedAt: string;
  scans: number;
  title?: string;
  description?: string;
  customization?: {
    foregroundColor?: string;
    backgroundColor?: string;
    logoUrl?: string;
    cornerRadius?: number;
    includeLogo?: boolean;
    logoSize?: number;
    size?: number;
  };
}

/**
 * Analytics Data Interface
 * @description Defines the structure of analytics data
 */
export interface AnalyticsData {
  clicksOverTime: TimeSeriesData[];
  deviceBreakdown: CategoryData[];
  browserStats: CategoryData[];
  geoDistribution: GeoData[];
  referrers: ReferrerData[];
  timeOfDayData: HourlyData[];
}

/**
 * Time Series Data Interface
 * @description Defines the structure of time series data
 */
export interface TimeSeriesData {
  date: string;
  clicks: number;
}

/**
 * Category Data Interface
 * @description Defines the structure of category-based data
 */
export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

/**
 * Geo Data Interface
 * @description Defines the structure of geographical data
 */
export interface GeoData {
  country: string;
  clicks: number;
  percentage: number;
}

/**
 * Referrer Data Interface
 * @description Defines the structure of referrer data
 */
export interface ReferrerData {
  source: string;
  clicks: number;
  percentage: number;
}

/**
 * Hourly Data Interface
 * @description Defines the structure of hourly data
 */
export interface HourlyData {
  hour: number;
  clicks: number;
}

/**
 * Dashboard Stats Interface
 * @description Defines the structure of dashboard summary statistics
 */
export interface DashboardStats {
  totalUrls: number;
  totalClicks: number;
  conversionRate: number;
  qrCodesGenerated: number;
  activeUrls: number;
  urlsCreatedToday: number;
  averageClicksPerUrl: number;
  mostClickedUrl?: Url;
  qrCodesCreatedToday?: number;
}

/**
 * URL Filter Interface
 * @description Defines the structure of URL filtering options
 */
export interface UrlFilter {
  search?: string;
  status?: "active" | "expired" | "inactive" | "all" | undefined;
  sortBy?: "created_at" | "clicks" | "title" | "expiry_date";
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Paginated Response Interface
 * @description Defines the structure of paginated API responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

/**
 * URL API Response Interface
 * @description Defines the structure of URL API response
 */
export interface UrlApiResponse {
  status: number;
  message: string;
  data: Url[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

/**
 * CTR Response Interface
 * @description Defines the structure for the total URLs count response
 */
export interface AnalysisPeriod {
  start_date: string;
  end_date: string;
  days: number;
}

export interface OverallStats {
  total_impressions: string;
  total_clicks: string;
  ctr: string;
  unique_impressions: string;
  unique_ctr: string;
  analysis_period: AnalysisPeriod;
}

export interface DailyPerformance {
  date: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

export interface SourceStats {
  source: string;
  impressions: string;
  clicks: string;
  ctr: string;
}

export interface CtrStatisticsData {
  overall: OverallStats;
  top_performing_days: DailyPerformance[];
  ctr_by_source: SourceStats[];
}

export interface CtrStatsResponse {
  status: number;
  message: string;
  data: CtrStatisticsData;
}

export interface CtrStatsParams {
  start_date?: string;
  end_date?: string;
  comparison?: "7" | "14" | "30" | "90" | "custom";
  custom_comparison_start?: string;
  custom_comparison_end?: string;
  group_by?: "day" | "week" | "month";
}

/**
 * URL Total Count Response Interface
 * @description Defines the structure for the total URLs count response
 */
export interface UrlTotalCountResponse {
  status: number;
  message: string;
  data: Url[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

/**
 * Total Clicks Response Interface
 * @description Defines the structure of the total clicks API response
 */
export interface TotalClicksResponse {
  status: number;
  message: string;
  data: {
    summary: {
      total_clicks: number;
      total_urls: number;
      avg_clicks_per_url: number;
      analysis_period: {
        start_date: string;
        end_date: string;
        days: number;
      };
      comparison: {
        period_days: number;
        previous_period: {
          start_date: string;
          end_date: string;
        };
        total_clicks: {
          current: number;
          previous: number;
          change: number;
          change_percentage: number;
        };
        avg_clicks_per_url: {
          current: number;
          previous: number;
          change: number;
          change_percentage: number;
        };
        active_urls: {
          current: number;
          previous: number;
          change: number;
          change_percentage: number;
        };
      };
    };
    time_series: {
      data: Array<{
        date: string;
        clicks: number;
        urls_count: number;
        avg_clicks: number;
      }>;
      pagination: {
        total_items: number;
        total_pages: number;
        current_page: number;
        limit: number;
      };
    };
    top_performing_days: Array<{
      date: string;
      clicks: number;
      urls_count: number;
      avg_clicks: number;
    }>;
  };
}

/**
 * Total Clicks Parameters Interface
 * @description Defines the parameters for the total clicks API request
 */
export interface TotalClicksParams {
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
 * Extended Dashboard Stats Interface
 * @description Extends the dashboard stats with total clicks data
 */
export interface ExtendedDashboardStats extends DashboardStats {
  /**
   * Total clicks data from API
   */
  totalClicksData?: {
    /**
     * Average clicks per URL from the API
     */
    avg_clicks_per_url: number;
    /**
     * Percentage change in total clicks
     */
    change_percentage: number;

    data?: TotalClicksResponse["data"];
  };

  /**
   * Conversion data from API
   */
  conversionData?: {
    /**
     * Total conversions from the API
     */
    totalConversions: number;
    /**
     * Percentage change in conversion rate
     */
    changePercentage: number;
    /**
     * Top clicks count
     */
    topClicksCount: number;
  };
}

export interface CreateUrlFormData {
  originalUrl: string;
  customCode?: string;
  title: string;
  expiryDate: string;
}

export interface CreateUrlFormResponse {
  status: number;
  message: string;
  data: {
    id: number;
    original_url: string;
    short_code: string;
    short_url: string;
    title: string;
    clicks: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    expiry_date: string;
    is_active: boolean;
  };
}

export interface EditUrlFormData {
  originalUrl: string;
  customCode?: string;
  title?: string;
  expiryDate?: string;
}

export interface EditUrlFormResponse {
  status: number;
  message: string;
  data: {
    id: number;
    original_url: string;
    short_code: string;
    short_url: string;
    title: string;
    clicks: number;
    created_at: string;
    updated_at: string;
    expiry_date: string;
    is_active: boolean;
  };
}

export interface CreateUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUrlFormData) => void;
}
