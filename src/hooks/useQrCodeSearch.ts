"use client";

import { useState, useEffect } from "react";
import { QrCodeFilter } from "@/interfaces/qrcode";

/**
 * Custom hook for handling QR code search and filtering
 * @param updateFilter - Function to update the filter
 * @param refreshQrCodes - Function to refresh QR codes
 * @returns Search state and handlers
 */
export const useQrCodeSearch = (
  updateFilter: (filter: Partial<QrCodeFilter>) => void,
  refreshQrCodes: () => Promise<boolean>
) => {
  // Search term state
  const [searchTerm, setSearchTerm] = useState("");

  // Track if there's an active search
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Apply search filter with debounce
  useEffect(() => {
    // Only proceed with the search if searchTerm has actually changed
    const timeoutId = setTimeout(() => {
      // Store the current search term to compare against
      const currentSearchTerm = searchTerm.trim();

      if (currentSearchTerm !== "") {
        // Set active search flag when searching
        setIsSearchActive(true);
        updateFilter({ search: currentSearchTerm, page: 1 });
      } else if (isSearchActive) {
        // Only clear search and refresh when coming from an active search state
        setIsSearchActive(false);
        updateFilter({ search: undefined, page: 1 });
        // Force refresh to get all QR codes
        refreshQrCodes();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, updateFilter, refreshQrCodes, isSearchActive]);

  /**
   * Handle search term changes
   * @param value - New search term
   */
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    isSearchActive,
    handleSearch,
  };
};
