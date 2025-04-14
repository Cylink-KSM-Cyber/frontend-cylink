import { useState, useEffect, useCallback } from "react";
import { Url, UrlFilter } from "@/interfaces/url";

/**
 * Custom hook for fetching and managing URLs
 * @param initialFilter - Initial filter settings
 * @returns URL data, loading state, and management functions
 */
export const useUrls = (initialFilter: UrlFilter = { page: 1, limit: 10 }) => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [filter, setFilter] = useState<UrlFilter>(initialFilter);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  /**
   * Fetch URLs based on current filter
   */
  const fetchUrls = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This will be replaced with actual API call when integrated
      // For now, return mock data that matches the interface
      const mockUrls: Url[] = Array(15)
        .fill(null)
        .map((_, index) => ({
          id: `url-${index + 1}`,
          originalUrl: `https://example.com/original/path/${index + 1}`,
          shortUrl: `cylink.co/${(Math.random() + 1)
            .toString(36)
            .substring(7)}`,
          title: index % 3 === 0 ? `Example URL ${index + 1}` : undefined,
          description:
            index % 4 === 0 ? `Description for URL ${index + 1}` : undefined,
          createdAt: new Date(
            Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 15
          ).toISOString(),
          expiresAt:
            index % 5 === 0
              ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
              : undefined,
          clicks: Math.floor(Math.random() * 200),
          status:
            index % 7 === 0
              ? "expired"
              : index % 11 === 0
              ? "inactive"
              : "active",
          userId: "user1",
          customDomain: index % 8 === 0 ? "custom-domain.com" : undefined,
          tags:
            index % 3 === 0
              ? ["marketing", "social"]
              : index % 4 === 0
              ? ["documentation"]
              : undefined,
          clickTrend: Math.random() * 40 - 20, // random between -20 and +20
        }));

      // Apply filtering logic based on filter state
      let filteredUrls = [...mockUrls];

      // Apply search filter
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredUrls = filteredUrls.filter(
          (url) =>
            url.originalUrl.toLowerCase().includes(searchLower) ||
            url.shortUrl.toLowerCase().includes(searchLower) ||
            url.title?.toLowerCase().includes(searchLower) ||
            false ||
            url.description?.toLowerCase().includes(searchLower) ||
            false
        );
      }

      // Apply status filter
      if (filter.status && filter.status !== "all") {
        filteredUrls = filteredUrls.filter(
          (url) => url.status === filter.status
        );
      }

      // Apply tag filter
      if (filter.tags && filter.tags.length > 0) {
        filteredUrls = filteredUrls.filter(
          (url) => url.tags?.some((tag) => filter.tags?.includes(tag)) || false
        );
      }

      // Apply date range filter
      if (filter.dateRange) {
        const { start, end } = filter.dateRange;
        const startDate = new Date(start).getTime();
        const endDate = new Date(end).getTime();

        filteredUrls = filteredUrls.filter((url) => {
          const createdAt = new Date(url.createdAt).getTime();
          return createdAt >= startDate && createdAt <= endDate;
        });
      }

      // Apply sorting
      if (filter.sortBy) {
        filteredUrls.sort((a, b) => {
          let valueA, valueB;

          switch (filter.sortBy) {
            case "clicks":
              valueA = a.clicks;
              valueB = b.clicks;
              break;
            case "lastClicked":
              // In a real implementation, this would use the last clicked timestamp
              // For now, using updatedAt as a proxy
              valueA = new Date(a.updatedAt).getTime();
              valueB = new Date(b.updatedAt).getTime();
              break;
            default: // createdAt
              valueA = new Date(a.createdAt).getTime();
              valueB = new Date(b.createdAt).getTime();
          }

          const direction = filter.sortDirection === "asc" ? 1 : -1;
          return (valueA > valueB ? 1 : -1) * direction;
        });
      }

      // Calculate pagination
      const total = filteredUrls.length;
      const totalPages = Math.ceil(total / filter.limit);

      // Apply pagination
      const startIndex = (filter.page - 1) * filter.limit;
      const endIndex = startIndex + filter.limit;
      const paginatedUrls = filteredUrls.slice(startIndex, endIndex);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      setUrls(paginatedUrls);
      setPagination({
        total,
        page: filter.page,
        limit: filter.limit,
        totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch URLs"));
      console.error("Failed to fetch URLs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  /**
   * Update filter settings
   * @param newFilter - New filter settings to apply
   */
  const updateFilter = (newFilter: Partial<UrlFilter>) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
      // Reset to page 1 if any filter other than page changes
      page: newFilter.page !== undefined ? newFilter.page : 1,
    }));
  };

  /**
   * Delete a URL
   * @param id - ID of URL to delete
   */
  const deleteUrl = async (id: string) => {
    try {
      // This will be replaced with actual API call
      // For now, just simulate deletion
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / filter.limit),
      }));
      return true;
    } catch (err) {
      console.error(`Failed to delete URL ${id}:`, err);
      return false;
    }
  };

  /**
   * Update a URL's status
   * @param id - ID of URL to update
   * @param status - New status value
   */
  const updateUrlStatus = async (id: string, status: Url["status"]) => {
    try {
      // This will be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUrls((prevUrls) =>
        prevUrls.map((url) =>
          url.id === id
            ? { ...url, status, updatedAt: new Date().toISOString() }
            : url
        )
      );
      return true;
    } catch (err) {
      console.error(`Failed to update URL ${id}:`, err);
      return false;
    }
  };

  return {
    urls,
    isLoading,
    error,
    pagination,
    filter,
    updateFilter,
    refreshUrls: fetchUrls,
    deleteUrl,
    updateUrlStatus,
  };
};
