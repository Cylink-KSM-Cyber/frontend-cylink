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
      // Store the current search value to compare against
      const currentSearchTerm = searchTerm.trim();
      const prevSearchTerm = prevSearchTermRef.current;

      console.log("Search effect running with:", {
        currentSearchTerm,
        prevSearchTerm,
        isSearchActive,
        isProcessing: isProcessingRef.current,
      });

      // Prevent running the effect if it's already processing
      if (isProcessingRef.current) {
        console.log("Skipping search effect as another one is in progress");
        return;
      }

      // Only proceed if the search term has actually changed
      if (currentSearchTerm === prevSearchTerm) {
        console.log("Search term unchanged, skipping update");
        return;
      }

      // Update the previous search term reference
      prevSearchTermRef.current = currentSearchTerm;

      // Set processing flag to prevent concurrent executions
      isProcessingRef.current = true;

      try {
        if (currentSearchTerm !== "") {
          // Set active search flag when searching
          console.log("Applying search filter:", currentSearchTerm);
          setIsSearchActive(true);
          updateFilter({ search: currentSearchTerm, page: 1 });
        } else if (isSearchActive) {
          // Only clear search and refresh when coming from an active search state
          console.log("Clearing search filter, was active");
          setIsSearchActive(false);
          updateFilter({ search: undefined, page: 1 });

          // Force refresh to get all QR codes
          console.log("Refreshing QR codes after clearing search");
          refreshQrCodes().then((success) => {
            console.log("QR codes refresh completed, success:", success);
          });
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
    console.log("Search term changed to:", value);
    setSearchTerm(value);
  };

  return {
    searchTerm,
    isSearchActive,
    handleSearch,
  };
};
