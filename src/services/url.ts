import { get, del, put } from "./api";
import { UrlApiResponse, UrlFilter, Url } from "@/interfaces/url";
import { UrlAnalyticsResponse } from "@/interfaces/urlAnalytics";
import logger from "@/utils/logger";

/**
 * URL Service
 * @description Service for interacting with URL-related API endpoints
 */

/**
 * Delete URL response interface
 * @interface DeleteUrlResponse
 */
export interface DeleteUrlResponse {
  status: number;
  message: string;
  data: {
    id: number;
    short_code: string;
    deleted_at: string;
  };
}

/**
 * Ensures short URLs have the correct format with a slash between host and code
 * @param url - The URL to fix
 * @returns Corrected URL with proper format
 */
export const fixShortUrl = (url: Url): Url => {
  const fixedUrl = { ...url };

  // Check if short_url exists and needs fixing (missing / between domain and code)
  if (fixedUrl.short_url) {
    const domainAndCode = fixedUrl.short_url.split("//");
    if (domainAndCode.length > 1) {
      const domain = domainAndCode[1].split(
        /([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/
      )[1];

      if (domain && !fixedUrl.short_url.includes(domain + "/")) {
        fixedUrl.short_url = fixedUrl.short_url.replace(domain, domain + "/");
      }
    }
  }

  return fixedUrl;
};

/**
 * Builds query parameters for URL API calls
 * @param filter - URL filter parameters
 * @returns Query string for API call
 */
const buildQueryParams = (filter: Partial<UrlFilter>): string => {
  const params = new URLSearchParams();

  // Add required parameters with default values if not provided
  params.append("page", String(filter.page ?? 1));
  params.append("limit", String(filter.limit ?? 10));

  // Make sure sortBy is set to a valid value
  const validSortByValues = ["created_at", "clicks", "title"];
  const sortByValue =
    filter.sortBy && validSortByValues.includes(filter.sortBy)
      ? filter.sortBy
      : "created_at";
  params.append("sortBy", sortByValue);

  // Make sure sortOrder is set to a valid value
  const validSortOrderValues = ["asc", "desc"];
  const sortOrderValue =
    filter.sortOrder && validSortOrderValues.includes(filter.sortOrder)
      ? filter.sortOrder
      : "desc";
  params.append("sortOrder", sortOrderValue);

  // Add optional parameters if present
  if (filter.search) params.append("search", filter.search);
  if (filter.status && filter.status !== "all")
    params.append("status", filter.status);
  if (filter.tags && filter.tags.length > 0)
    params.append("tags", filter.tags.join(","));

  return params.toString();
};

/**
 * Fetch URLs from API with filtering
 * @param filter - URL filter parameters
 * @returns Promise with URL API response
 */
export const fetchUrls = async (
  filter: Partial<UrlFilter> = {}
): Promise<UrlApiResponse> => {
  logger.debug("Original filter for URL fetch", { filter });
  const queryParams = buildQueryParams(filter);
  logger.debug("Query params for URL fetch", { queryParams });
  const queryString = queryParams ? `?${queryParams}` : "";
  const endpoint = `/api/v1/urls${queryString}`;
  logger.debug("Full endpoint for URL fetch", { endpoint });

  const response = await get<UrlApiResponse>(endpoint);

  // Fix short URLs in the response if needed
  if (response?.data) {
    response.data = response.data.map(fixShortUrl);
  }

  return response;
};

/**
 * Delete URL by ID
 * @param id - ID of the URL to delete
 * @returns Promise with the API response
 */
export const deleteUrlById = async (id: number): Promise<DeleteUrlResponse> => {
  logger.info("Deleting URL", { id });
  const endpoint = `/api/v1/urls/${id}`;
  return del<DeleteUrlResponse>(endpoint);
};

/**
 * Update URL status by ID (active/inactive)
 * @param id - ID of the URL to update
 * @param isActive - New status value
 * @returns Promise with API response
 */
export const updateUrlStatusById = async (id: number, isActive: boolean) => {
  logger.info("Updating URL status", {
    id,
    status: isActive ? "active" : "inactive",
  });
  const endpoint = `/api/v1/urls/${id}/status`;
  return put(endpoint, { is_active: isActive });
};

/**
 * Fetch analytics data for a specific URL
 * @param id - URL ID
 * @returns Analytics data for the specific URL
 */
export const fetchUrlAnalytics = async (
  id: number
): Promise<UrlAnalyticsResponse> => {
  try {
    const endpoint = `/api/v1/urls/${id}/analytics`;
    return await get<UrlAnalyticsResponse>(endpoint);
  } catch (error) {
    logger.error("Failed to fetch URL analytics", { id, error });
    throw error;
  }
};
