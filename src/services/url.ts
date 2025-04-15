import { get } from "./api";
import { UrlApiResponse, UrlFilter } from "@/interfaces/url";

/**
 * URL Service
 * @description Service for interacting with URL-related API endpoints
 */

/**
 * Builds query parameters for URL API calls
 * @param filter - URL filter parameters
 * @returns Query string for API call
 */
const buildQueryParams = (filter: Partial<UrlFilter>): string => {
  const params = new URLSearchParams();

  // Add required parameters with default values if not provided
  params.append("page", String(filter.page || 1));
  params.append("limit", String(filter.limit || 10));

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
  console.log("Original filter:", filter);
  const queryParams = buildQueryParams(filter);
  console.log("Query params:", queryParams);
  const endpoint = `/api/v1/urls${queryParams ? `?${queryParams}` : ""}`;
  console.log("Full endpoint:", endpoint);

  return get<UrlApiResponse>(endpoint);
};
