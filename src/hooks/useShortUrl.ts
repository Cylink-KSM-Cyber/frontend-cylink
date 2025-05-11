import { useState } from "react";
import { get } from "@/services/api";

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
 * Uses the correct API endpoint structure: /api/v1/urls/{identifier}
 */
export const useShortUrl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch the original URL for a short code using the correct API endpoint
   * @param shortCode The short code to lookup
   * @returns Promise resolving to the original URL or null if not found
   */
  const getOriginalUrl = async (shortCode: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching original URL for short code: ${shortCode}`);

      // Create API URL with the correct endpoint structure
      const apiUrl = `/api/v1/urls/${shortCode}`;
      console.log(`API URL: ${apiUrl}`);

      // Make the API request
      const response = await get<ShortUrlResponse>(apiUrl);
      console.log(`API Response:`, response);

      // Extract the original URL from various possible response structures
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

      if (originalUrl) {
        // Attempt to record the click asynchronously
        recordUrlClick(shortCode).catch((err) => {
          console.error(`Failed to record click for ${shortCode}:`, err);
        });

        return originalUrl;
      }

      console.warn(`No original URL found for short code: ${shortCode}`);
      return null;
    } catch (error) {
      console.error(`Error fetching original URL for ${shortCode}:`, error);
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
      console.log(`Successfully recorded click for ${shortCode}`);
    } catch (error) {
      console.error(`Failed to record click for ${shortCode}:`, error);
      // Don't throw - we don't want to block the main redirect flow
    }
  };

  return {
    getOriginalUrl,
    isLoading,
    error,
  };
};

export default useShortUrl;
