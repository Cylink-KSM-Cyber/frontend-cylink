import { get, del, put, getPublic } from "./api";
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
  const validSortByValues = [
    "created_at",
    "clicks",
    "title",
    "expiry_date",
    "status",
  ];
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

/**
 * Fetch a URL by its short code
 * @param shortCode - The short code of the URL
 * @returns Promise with URL data
 */
export const fetchUrlByShortCode = async (shortCode: string): Promise<Url> => {
  try {
    console.log(`Fetching URL with short code: ${shortCode}`);
    const endpoint = `/api/v1/urls/by-code/${shortCode}`;

    // Log endpoint to understand API request
    console.log(`Fetching from endpoint: ${endpoint}`);

    const response = await get<{ status: number; message: string; data: Url }>(
      endpoint
    );

    console.log(`Response for URL with code ${shortCode}:`, response);

    // Check response structure - different APIs might return data differently
    if (response && response.data) {
      console.log(`URL data retrieved for ${shortCode}:`, response.data);
      return response.data;
    } else if (
      response &&
      typeof response === "object" &&
      "original_url" in response
    ) {
      // Handle case where the response itself is the URL object
      console.log(
        `URL data is directly in response for ${shortCode}:`,
        response
      );
      return response as unknown as Url;
    }

    throw new Error(`URL not found for code: ${shortCode}`);
  } catch (error) {
    console.error(`Failed to fetch URL with short code ${shortCode}:`, error);
    throw error;
  }
};

/**
 * Record a click on a URL
 * @param shortCode - The short code of the URL that was clicked
 */
export const recordUrlClick = async (shortCode: string): Promise<void> => {
  try {
    console.log(`Recording click for URL with short code: ${shortCode}`);
    const endpoint = `/api/v1/urls/click/${shortCode}`;
    await get(endpoint);
  } catch (error) {
    console.error(
      `Failed to record click for URL with short code ${shortCode}:`,
      error
    );
    // Don't throw error - we don't want to interrupt the user flow if this fails
  }
};

/**
 * Fetch a URL by its identifier
 * @param identifier - The identifier (short code) of the URL
 * @returns Promise with URL data
 */
export const fetchUrlByIdentifier = async (
  identifier: string
): Promise<Url> => {
  try {
    console.log(`Fetching URL with identifier: ${identifier}`);
    const endpoint = `/api/v1/urls/${identifier}`;

    // Log endpoint to understand API request
    console.log(`Fetching from endpoint: ${endpoint}`);

    const response = await get<{ status: number; message: string; data: Url }>(
      endpoint
    );

    console.log(`Response for URL with identifier ${identifier}:`, response);

    // Check response structure - different APIs might return data differently
    if (response && response.data) {
      console.log(`URL data retrieved for ${identifier}:`, response.data);
      return response.data;
    } else if (
      response &&
      typeof response === "object" &&
      "original_url" in response
    ) {
      // Handle case where the response itself is the URL object
      console.log(
        `URL data is directly in response for ${identifier}:`,
        response
      );
      return response as unknown as Url;
    }

    throw new Error(`URL not found for identifier: ${identifier}`);
  } catch (error) {
    console.error(`Failed to fetch URL with identifier ${identifier}:`, error);
    throw error;
  }
};

/**
 * Fetch a URL by its short code without authentication
 * @param shortCode - The short code of the URL
 * @returns Promise with URL data
 */
export const fetchPublicUrlByShortCode = async (
  shortCode: string
): Promise<Url> => {
  try {
    logger.urlShortener.info(
      `Fetching public URL with short code: ${shortCode}`
    );
    const endpoint = `/api/v1/public/urls/${shortCode}`;

    // Use getPublic to ensure no authentication headers are sent
    const response = await getPublic<{
      status: number;
      message: string;
      data: Url;
    }>(endpoint);

    logger.urlShortener.debug(`Received response for short code: ${shortCode}`);

    // Check response structure
    if (response && response.data) {
      logger.urlShortener.info(`URL data retrieved for ${shortCode}`);
      return response.data;
    } else if (
      response &&
      typeof response === "object" &&
      "original_url" in response
    ) {
      // Handle case where the response itself is the URL object
      logger.urlShortener.debug(`Response contains URL data directly`);

      // Create a properly structured URL object
      const originalUrl = String(response.original_url);
      const urlObject: Url = {
        id: 0,
        original_url: originalUrl,
        short_code: shortCode,
        short_url: `https://cylink.id/${shortCode}`,
        clicks: 0,
        is_active: true,
        user_id: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return urlObject;
    }

    throw new Error(`Public URL not found for code: ${shortCode}`);
  } catch (error) {
    logger.urlShortener.error(
      `Failed to fetch public URL: ${shortCode}`,
      error
    );
    throw error;
  }
};
