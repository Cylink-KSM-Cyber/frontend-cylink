import { useState, useEffect } from "react";
import { QrCode } from "@/interfaces/url";
import { fetchQrCodes } from "@/services/qrcode";
import { QrCodeFilter } from "@/interfaces/qrcode";

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
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 1,
  });

  useEffect(() => {
    const fetchQrCodesList = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get QR codes from API
        const response = await fetchQrCodes(filter);

        // Map API response to our internal QrCode type
        const mappedQrCodes: QrCode[] = response.data.map((qrCode) => ({
          id: qrCode.id,
          urlId: qrCode.url_id,
          imageUrl: qrCode.qr_code_url || qrCode.png_url, // Use QR code URL or PNG URL as fallback
          createdAt: qrCode.created_at,
          updatedAt: qrCode.updated_at,
          scans: 0, // API doesn't provide scans count yet
          title: qrCode.url?.title,
          description: qrCode.url?.original_url,
          customization: {
            foregroundColor: qrCode.color,
            backgroundColor: qrCode.background_color,
            logoUrl: qrCode.include_logo ? "logo_placeholder" : undefined, // Placeholder
            cornerRadius: 0, // Not supported by API yet
          },
        }));

        // Update state with mapped QR codes and pagination info
        setQrCodes(mappedQrCodes);
        setPagination(response.pagination);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch QR codes")
        );
        console.error("Failed to fetch QR codes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCodesList();
  }, [filter]);

  /**
   * Update filter parameters
   * @param newFilter - New filter parameters to apply
   */
  const updateFilter = (newFilter: Partial<QrCodeFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  /**
   * Delete a QR Code
   * @param id - ID of QR Code to delete
   */
  const deleteQrCode = async (id: string | number) => {
    try {
      // This will be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setQrCodes((prevCodes) =>
        prevCodes.filter((code) => String(code.id) !== String(id))
      );
      return true;
    } catch (err) {
      console.error(`Failed to delete QR Code ${id}:`, err);
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
    setIsLoading(true);
    setError(null);

    try {
      // Get QR codes from API
      const response = await fetchQrCodes(filter);

      // Map API response to our internal QrCode type
      const mappedQrCodes: QrCode[] = response.data.map((qrCode) => ({
        id: qrCode.id,
        urlId: qrCode.url_id,
        imageUrl: qrCode.qr_code_url || qrCode.png_url, // Use QR code URL or PNG URL as fallback
        createdAt: qrCode.created_at,
        updatedAt: qrCode.updated_at,
        scans: 0, // API doesn't provide scans count yet
        title: qrCode.url?.title,
        description: qrCode.url?.original_url,
        customization: {
          foregroundColor: qrCode.color,
          backgroundColor: qrCode.background_color,
          logoUrl: qrCode.include_logo ? "logo_placeholder" : undefined, // Placeholder
          cornerRadius: 0, // Not supported by API yet
        },
      }));

      // Update state with mapped QR codes and pagination info
      setQrCodes(mappedQrCodes);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to refresh QR codes")
      );
      console.error("Failed to refresh QR codes:", err);
    } finally {
      setIsLoading(false);
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
