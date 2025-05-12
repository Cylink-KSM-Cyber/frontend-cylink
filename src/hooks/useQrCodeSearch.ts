"use client";

import { useState, useEffect, useRef } from "react";
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

  // Reference to store previous search term for comparison
  const prevSearchTermRef = useRef("");

  // Reference to track if search effect is currently processing
  const isProcessingRef = useRef(false);

  // Apply search filter with debounce
  useEffect(() => {
    // Only proceed with the search if searchTerm has actually changed
    const timeoutId = setTimeout(() => {
      // Store the current search term to compare against
      const currentSearchTerm = searchTerm.trim();
      const prevSearchTerm = prevSearchTermRef.current;

      // Prevent running the effect if it's already processing
      if (isProcessingRef.current) {
        return;
      }

      // Only proceed if the search term has actually changed
      if (currentSearchTerm === prevSearchTerm) {
        return;
      }

      // Update the previous search term reference
      prevSearchTermRef.current = currentSearchTerm;

      // Set processing flag to prevent concurrent executions
      isProcessingRef.current = true;

      try {
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
      } finally {
        // Clear processing flag when done
        isProcessingRef.current = false;
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
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
