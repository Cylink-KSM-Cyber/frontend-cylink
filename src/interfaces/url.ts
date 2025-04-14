/**
 * URL Interface
 * @description Defines the structure of a shortened URL entity
 */
export interface Url {
  id: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  clicks: number;
  status: "active" | "expired" | "inactive";
  userId: string;
  customDomain?: string;
  tags?: string[];
  clickTrend?: number; // Percentage change in clicks (e.g., +15%)
}

/**
 * QR Code Interface
 * @description Defines the structure of a QR code entity
 */
export interface QrCode {
  id: string;
  urlId: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  customization?: {
    foregroundColor?: string;
    backgroundColor?: string;
    logoUrl?: string;
    cornerRadius?: number;
  };
  scans: number;
  title?: string;
  description?: string;
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
}

/**
 * URL Filter Interface
 * @description Defines the structure of URL filtering options
 */
export interface UrlFilter {
  search?: string;
  status?: "active" | "expired" | "inactive" | "all";
  sortBy?: "createdAt" | "clicks" | "lastClicked";
  sortDirection?: "asc" | "desc";
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
    totalPages: number;
  };
}
