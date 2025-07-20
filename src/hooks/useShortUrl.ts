import { useState } from "react";
import { get, getPublic } from "@/services/api";
import { AxiosError } from "axios";
import logger from "@/utils/logger";

/**
 * Response interface for short URL lookup
 */
interface ShortUrlResponse {
  status?: number;
  message?: string;
  data?: {
    original_url?: string;
    [key: string]: unknown;
  };
  original_url?: string;
  [key: string]: unknown;
}

/**
 * Hook for resolving short URLs to their original URLs
 * Uses public endpoint first, then falls back to authenticated endpoint if necessary
 */
export const useShortUrl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Extract original URL from API response
   * @param response The API response object
   * @returns The original URL or null if not found
   */
  const extractOriginalUrl = (response: ShortUrlResponse): string | null => {
    let originalUrl: string | null = null;

    if (response && typeof response === "object") {
      // Direct response contains original_url
      if (
        "original_url" in response &&
        typeof response.original_url === "string"
      ) {
        originalUrl = response.original_url;
      }
      // Response has data property with original_url
      else if (
        "data" in response &&
        response.data &&
        typeof response.data === "object"
      ) {
        const data = response.data;
        if ("original_url" in data && typeof data.original_url === "string") {
          originalUrl = data.original_url;
        }
      }
    }

    return originalUrl;
  };

  /**
   * Fetch the original URL for a short code using the correct API endpoint
   * @param shortCode The short code to lookup
   * @returns Promise resolving to the original URL or null if not found
   */
  const getOriginalUrl = async (shortCode: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      logger.urlShortener.info(
        `Client fetching URL for short code: ${shortCode}`
      );

      // Try the public endpoint first (no authentication required)
      try {
        const publicApiUrl = `/api/v1/public/urls/${shortCode}`;
        logger.urlShortener.debug(
          `Trying public API endpoint: ${publicApiUrl}`
        );

        // Use getPublic to ensure no authentication headers are sent
        const publicResponse = await getPublic<ShortUrlResponse>(publicApiUrl);

        const originalUrl = extractOriginalUrl(publicResponse);
        if (originalUrl) {
          logger.urlShortener.info(
            `Found URL from public endpoint: ${shortCode}`
          );

          // Record the click asynchronously
          recordUrlClick(shortCode).catch((err) => {
            logger.urlShortener.warn(
              `Failed to record click for ${shortCode}`,
              err
            );
          });

          return originalUrl;
        }
      } catch (publicError) {
        // Check if the error is a 404 (URL not found)
        const is404Error =
          // Check if it's an Axios error with status 404
          (publicError instanceof Error &&
            publicError instanceof AxiosError &&
            publicError.response?.status === 404) ||
          // Or check message content for other error types
          (publicError instanceof Error && publicError.message.includes("404"));

        if (is404Error) {
          // If it's a 404, don't try the authenticated endpoint
          logger.urlShortener.info(`Short URL not found: ${shortCode}`);
          return null;
        }

        logger.urlShortener.warn(
          `Public endpoint error for ${shortCode}, falling back to authenticated endpoint`,
          publicError
        );
      }

      // Fall back to authenticated endpoint only for non-404 errors
      const apiUrl = `/api/v1/urls/${shortCode}`;
      logger.urlShortener.debug(`Trying authenticated endpoint: ${apiUrl}`);

      // Make the API request
      const response = await get<ShortUrlResponse>(apiUrl);

      // Extract the original URL from the response
      const originalUrl = extractOriginalUrl(response);

      if (originalUrl) {
        logger.urlShortener.info(
          `Found URL from authenticated endpoint: ${shortCode}`
        );

        // Attempt to record the click asynchronously
        recordUrlClick(shortCode).catch((err) => {
          logger.urlShortener.warn(
            `Failed to record click for ${shortCode}`,
            err
          );
        });

        return originalUrl;
      }

      logger.urlShortener.info(
        `No original URL found for short code: ${shortCode}`
      );
      return null;
    } catch (error) {
      logger.urlShortener.error(
        `Error fetching URL for short code: ${shortCode}`,
        error
      );
      setError(error instanceof Error ? error : new Error(String(error)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Record a click on a short URL
   * @param shortCode The short code that was clicked
   */
  const recordUrlClick = async (shortCode: string): Promise<void> => {
    try {
      const endpoint = `/api/v1/urls/click/${shortCode}`;
      await get(endpoint);
      logger.urlShortener.debug(`Click recorded for ${shortCode}`);

      // Track URL click conversion in PostHog
      try {
        const posthogClient = (await import("@/utils/posthogClient")).default;
        posthogClient.captureEvent("url_clicked", {
          short_code: shortCode,
          timestamp: new Date().toISOString(),
          source: window.location.pathname,
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          referrer: document.referrer || undefined,
          device_type: getDeviceType(),
          location: await getGeographicLocation(),
        });
      } catch (posthogError) {
        logger.urlShortener.warn(
          `Failed to track PostHog event for ${shortCode}`,
          posthogError
        );
      }
    } catch (error) {
      logger.urlShortener.warn(
        `Failed to record click for ${shortCode}`,
        error
      );
      // Don't throw - we don't want to block the main redirect flow
    }
  };

  /**
   * Get device type based on user agent
   * @returns Device type string
   */
  const getDeviceType = (): "mobile" | "desktop" | "tablet" | "other" => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/mobile|android|iphone|ipad|phone/.test(userAgent)) {
      return "mobile";
    }

    if (/tablet|ipad/.test(userAgent)) {
      return "tablet";
    }

    return "desktop";
  };

  /**
   * Get geographic location if available
   * @returns Promise with location string or undefined
   */
  const getGeographicLocation = async (): Promise<string | undefined> => {
    try {
      // Try to get location from IP geolocation (if available)
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return `${data.city}, ${data.country_name}`;
    } catch {
      // Fallback to timezone as location indicator
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  };

  return {
    getOriginalUrl,
    isLoading,
    error,
  };
};

export default useShortUrl;
