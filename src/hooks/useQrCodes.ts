import { useState, useEffect, useRef } from "react";
import { QrCode } from "@/interfaces/url";
import { fetchQrCodes, deleteQrCodeById } from "@/services/qrcode";
import { QrCodeFilter } from "@/interfaces/qrcode";
import { useToast } from "@/contexts/ToastContext";

// Helper function to check if two filters are equal
const areFiltersEqual = (
  filterA: QrCodeFilter,
  filterB: QrCodeFilter
): boolean => {
  // Specifically compare relevant fields that would trigger a new API call
  return (
    filterA.page === filterB.page &&
    filterA.limit === filterB.limit &&
    filterA.sortBy === filterB.sortBy &&
    filterA.sortOrder === filterB.sortOrder &&
    filterA.search === filterB.search &&
    filterA.color === filterB.color &&
    filterA.includeLogo === filterB.includeLogo &&
    filterA.includeUrl === filterB.includeUrl
  );
};

/**
 * Custom hook for fetching and managing QR Codes
 * @returns QR Code data and loading state
 */
export const useQrCodes = (initialFilter?: QrCodeFilter) => {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<QrCodeFilter>(
    initialFilter || {
      page: 1,
      limit: 10,
      sortBy: "created_at",
      sortOrder: "desc",
      includeUrl: true,
    }
  );

  // Keep track of previous filter to prevent unnecessary fetches
  const prevFilterRef = useRef<QrCodeFilter | null>(null);

  // Fetch in progress flag to prevent concurrent fetches
  const isFetchingRef = useRef<boolean>(false);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  });

  // Get toast context
  const { showToast } = useToast();

  useEffect(() => {
    const fetchQrCodesList = async () => {
      // Skip if a fetch is already in progress
      if (isFetchingRef.current) {
        return;
      }

      // Skip if filter is the same as previous one
      if (
        prevFilterRef.current &&
        areFiltersEqual(filter, prevFilterRef.current)
      ) {
        return;
      }

      // Set fetching flag
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Update previous filter reference
        prevFilterRef.current = { ...filter };

        // Get QR codes from API
        const response = await fetchQrCodes(filter);

        // Map API response to our internal QrCode type
        const mappedQrCodes: QrCode[] = response.data.map((qrCode) => {
          return {
            id: qrCode.id,
            urlId: qrCode.url_id,
            shortCode: qrCode.short_code,
            shortUrl: qrCode.short_url,
            // We're not going to use these image URLs anymore since they don't work
            imageUrl: undefined,
            pngUrl: undefined,
            svgUrl: undefined,
            createdAt: qrCode.created_at,
            updatedAt: qrCode.updated_at,
            scans: qrCode.url?.clicks || 0, // Use URL clicks as scans count
            title: qrCode.url?.title || qrCode.short_code,
            description: qrCode.url?.original_url,
            customization: {
              foregroundColor: qrCode.color || "#000000",
              backgroundColor: qrCode.background_color || "#FFFFFF",
              includeLogo: qrCode.include_logo,
              logoSize: qrCode.logo_size || 0.25, // Default to 25% if not provided
              size: qrCode.size || 300, // Default size if not provided
              logoUrl: qrCode.include_logo ? "/logo/logo-ksm.svg" : undefined,
              cornerRadius: 0, // Not supported by API yet
            },
          };
        });

        // Update state with mapped QR codes and pagination info
        setQrCodes(mappedQrCodes);
        setPagination(response.pagination);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch QR codes";
        setError(err instanceof Error ? err : new Error(errorMessage));
        console.error("Failed to fetch QR codes:", err);
        showToast(errorMessage, "error", 5000);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };

    fetchQrCodesList();
  }, [filter, showToast]);

  /**
   * Update filter parameters
   * @param newFilter - New filter parameters to apply
   */
  const updateFilter = (newFilter: Partial<QrCodeFilter>) => {
    // Create a new filter object by merging the previous filter with the new filter
    const updatedFilter = { ...filter, ...newFilter };

    // Check if the filter is actually changing
    if (areFiltersEqual(filter, updatedFilter)) {
      return;
    }

    setFilter(updatedFilter);
  };

  /**
   * Delete a QR Code
   * @param id - ID of QR Code to delete
   */
  const deleteQrCode = async (id: string | number) => {
    try {
      // Call the API to delete the QR code
      await deleteQrCodeById(id);

      // Update local state by removing the deleted QR code
      setQrCodes((prevCodes) =>
        prevCodes.filter((code) => String(code.id) !== String(id))
      );

      // Show success toast
      showToast("QR code deleted successfully", "success", 4000);

      return true;
    } catch (err) {
      // Handle error
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete QR Code";
      console.error(`Failed to delete QR Code ${id}:`, err);
      showToast(errorMessage, "error", 4000);

      return false;
    }
  };

  /**
   * Generate a QR Code for a URL
   * @param urlId - ID of URL to generate QR Code for
   * @param customization - Optional customization options
   */
  const generateQrCode = async (
    urlId: string | number,
    customization?: QrCode["customization"],
    title?: string,
    description?: string
  ) => {
    try {
      // This will be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newQrCode: QrCode = {
        id: Date.now(),
        urlId: typeof urlId === "string" ? parseInt(urlId) || 0 : urlId,
        imageUrl: `https://placehold.co/200x200?text=New+QR+Code`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scans: 0,
        title,
        description,
        customization,
      };

      setQrCodes((prevCodes) => [newQrCode, ...prevCodes]);
      return newQrCode;
    } catch (err) {
      console.error(`Failed to generate QR Code for URL ${urlId}:`, err);
      throw err;
    }
  };

  /**
   * Refresh QR Code data
   */
  const refreshQrCodes = async () => {
    // Skip if a fetch is already in progress
    if (isFetchingRef.current) {
      return false;
    }

    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      // Get QR codes from API with current filter
      const response = await fetchQrCodes(filter);

      // Map API response to our internal QrCode type
      const mappedQrCodes: QrCode[] = response.data.map((qrCode) => {
        return {
          id: qrCode.id,
          urlId: qrCode.url_id,
          shortCode: qrCode.short_code,
          shortUrl: qrCode.short_url,
          // We're not going to use these image URLs anymore since they don't work
          imageUrl: undefined,
          pngUrl: undefined,
          svgUrl: undefined,
          createdAt: qrCode.created_at,
          updatedAt: qrCode.updated_at,
          scans: qrCode.url?.clicks || 0, // Use URL clicks as scans count
          title: qrCode.url?.title || qrCode.short_code,
          description: qrCode.url?.original_url,
          customization: {
            foregroundColor: qrCode.color || "#000000",
            backgroundColor: qrCode.background_color || "#FFFFFF",
            includeLogo: qrCode.include_logo,
            logoSize: qrCode.logo_size || 0.25, // Default to 25% if not provided
            size: qrCode.size || 300, // Default size if not provided
            logoUrl: qrCode.include_logo ? "/logo/logo-ksm.svg" : undefined,
            cornerRadius: 0, // Not supported by API yet
          },
        };
      });

      // Update state with mapped QR codes and pagination info
      setQrCodes(mappedQrCodes);
      setPagination(response.pagination);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh QR codes";
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error("Failed to refresh QR codes:", err);
      showToast(errorMessage, "error", 5000);
      return false;
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  return {
    qrCodes,
    isLoading,
    error,
    pagination,
    updateFilter,
    deleteQrCode,
    generateQrCode,
    refreshQrCodes,
  };
};
