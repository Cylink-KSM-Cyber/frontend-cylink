"use client";

import { useState, useRef, useMemo } from "react";
import { fetchUrls } from "@/services/url";
import { Url } from "@/interfaces/url";
import { RECENT_URLS_LIMIT, POPULAR_URLS_LIMIT } from "@/config/qrcode";

/**
 * URL Selection Hook
 * @description Manages URL selection state and operations for QR code creation
 */
export const useUrlSelection = () => {
  // State for existing URLs
  const [existingUrls, setExistingUrls] = useState<Url[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<Url | null>(null);

  // Refs for tracking API fetch state
  const urlsFetchedRef = useRef(false);
  const fetchInProgressRef = useRef(false);

  /**
   * Fetch existing URLs from API
   */
  const fetchExistingUrls = async (): Promise<boolean> => {
    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      return false;
    }

    fetchInProgressRef.current = true;
    setIsLoadingUrls(true);

    try {
      const response = await fetchUrls({
        limit: 100,
        sortBy: "created_at",
        sortOrder: "desc",
        status: "active", // Only fetch active URLs that are not expired
      });

      if (response.status === 200 && response.data) {
        setExistingUrls(response.data);
        urlsFetchedRef.current = true;
        return true;
      } else {
        console.error("Failed to fetch URLs:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
      return false;
    } finally {
      setIsLoadingUrls(false);
      fetchInProgressRef.current = false;
    }
  };

  /**
   * Initialize URL loading (only fetch once)
   */
  const initializeUrls = () => {
    if (!urlsFetchedRef.current && !fetchInProgressRef.current) {
      fetchExistingUrls();
    }
  };

  /**
   * Refresh URLs (force fetch)
   */
  const refreshUrls = async (): Promise<boolean> => {
    urlsFetchedRef.current = false;
    return await fetchExistingUrls();
  };

  /**
   * Select a URL by ID
   */
  const selectUrlById = (
    urlId: number | string | null | undefined
  ): Url | null => {
    if (!urlId) {
      setSelectedUrl(null);
      return null;
    }

    const found = existingUrls.find((url) => url.id === Number(urlId));
    setSelectedUrl(found || null);
    return found || null;
  };

  /**
   * Clear URL selection
   */
  const clearSelection = () => {
    setSelectedUrl(null);
  };

  /**
   * Get recent URLs (last N URLs)
   */
  const recentUrls = useMemo(() => {
    return existingUrls
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, RECENT_URLS_LIMIT);
  }, [existingUrls]);

  /**
   * Get popular URLs (top N by clicks)
   */
  const popularUrls = useMemo(() => {
    return existingUrls
      .filter((url) => url.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, POPULAR_URLS_LIMIT);
  }, [existingUrls]);

  /**
   * Filter URLs based on search query
   */
  const filterUrls = (searchQuery: string): Url[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return existingUrls.filter(
      (url) =>
        url.title?.toLowerCase().includes(query) ||
        url.original_url.toLowerCase().includes(query) ||
        url.short_url.toLowerCase().includes(query)
    );
  };

  /**
   * Get URL statistics
   */
  const urlStats = useMemo(
    () => ({
      total: existingUrls.length,
      hasUrls: existingUrls.length > 0,
      hasPopularUrls: popularUrls.length > 0,
      hasRecentUrls: recentUrls.length > 0,
    }),
    [existingUrls, popularUrls, recentUrls]
  );

  /**
   * Find URL by ID
   */
  const findUrlById = (urlId: number | string): Url | undefined => {
    return existingUrls.find((url) => url.id === Number(urlId));
  };

  return {
    // State
    existingUrls,
    isLoadingUrls,
    selectedUrl,
    recentUrls,
    popularUrls,
    urlStats,

    // Actions
    initializeUrls,
    refreshUrls,
    selectUrlById,
    clearSelection,
    filterUrls,
    findUrlById,

    // Status
    isInitialized: urlsFetchedRef.current,
    isFetching: fetchInProgressRef.current,
  };
};
