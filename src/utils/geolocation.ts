/**
 * Geolocation utility with caching
 * @description Provides cached geolocation services to prevent performance bottlenecks
 * @author CyLink Frontend Team
 */

import logger from "@/utils/logger";

/**
 * Geolocation cache manager
 * @description Caches geolocation data to prevent repeated API calls
 */
class GeolocationCache {
  private static cache = new Map<
    string,
    { location: string; timestamp: number }
  >();
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly CACHE_KEY = "user_location";

  /**
   * Get cached or fresh geolocation data
   * @description Returns cached location if valid, otherwise fetches new data
   * @returns Promise resolving to location string or undefined
   */
  static async getLocation(): Promise<string | undefined> {
    if (typeof window === "undefined") return undefined;

    const cached = this.cache.get(this.CACHE_KEY);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      logger.debug("Returning cached location data");
      return cached.location;
    }

    try {
      logger.debug("Fetching fresh geolocation data");
      const response = await fetch("https://ipapi.co/json/");

      if (!response.ok) {
        throw new Error(`Geolocation API returned ${response.status}`);
      }

      const data = await response.json();
      const location = `${data.city}, ${data.country_name}`;

      this.cache.set(this.CACHE_KEY, { location, timestamp: Date.now() });
      logger.debug("Geolocation data cached successfully");

      return location;
    } catch (error) {
      logger.warn(
        "Failed to fetch geolocation data, using timezone fallback",
        error
      );
      // Fallback to timezone as location indicator
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  /**
   * Clear the geolocation cache
   * @description Removes all cached geolocation data
   */
  static clearCache(): void {
    this.cache.clear();
    logger.debug("Geolocation cache cleared");
  }

  /**
   * Get cache statistics
   * @description Returns information about cache state
   * @returns Cache statistics object
   */
  static getCacheStats(): { size: number; hasValidCache: boolean } {
    const cached = this.cache.get(this.CACHE_KEY);
    const hasValidCache = Boolean(
      cached && Date.now() - cached.timestamp < this.CACHE_DURATION
    );

    return {
      size: this.cache.size,
      hasValidCache,
    };
  }
}

export default GeolocationCache;
