"use client";

import { QrCodeFilter } from "@/interfaces/qrcode";

/**
 * Custom hook for handling QR code filtering and pagination
 * @param updateFilter - Function to update the filter
 * @returns Filter handlers for pagination, sorting, filtering, and view mode
 */
export const useQrCodeFilter = (
  updateFilter: (filter: Partial<QrCodeFilter>) => void
) => {
  /**
   * Handle page change
   * @param page - Page number to change to
   */
  const handlePageChange = (page: number) => {
    updateFilter({ page });
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Handle filter change
   * @param newFilter - New filter parameters to apply
   */
  const handleFilterChange = (newFilter: Partial<QrCodeFilter>) => {
    // Reset to page 1 when filter changes
    updateFilter({ ...newFilter, page: 1 });
  };

  /**
   * Handle sort change
   * @param sortBy - Field to sort by
   * @param sortOrder - Sort order (asc or desc)
   */
  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    updateFilter({ sortBy, sortOrder });
  };

  /**
   * Handle view mode change
   * @param mode - View mode (grid or list)
   */
  const handleViewModeChange = (mode: "grid" | "list") => {
    // Adjust items per page based on view mode
    updateFilter({ limit: mode === "grid" ? 12 : 10, page: 1 });
    return mode;
  };

  return {
    handlePageChange,
    handleFilterChange,
    handleSortChange,
    handleViewModeChange,
  };
};
