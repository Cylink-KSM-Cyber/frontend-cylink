import { useState, useEffect } from "react";
import { QrCode } from "@/interfaces/url";

/**
 * Custom hook for fetching and managing QR Codes
 * @returns QR Code data and loading state
 */
export const useQrCodes = () => {
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchQrCodes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // This will be replaced with actual API call when integrated
        // For now, return mock data that matches the interface
        const mockQrCodes: QrCode[] = Array(6)
          .fill(null)
          .map((_, index) => ({
            id: `qr-${index + 1}`,
            urlId: `url-${index + 1}`,
            imageUrl: `https://placehold.co/200x200?text=QR+Code+${index + 1}`,
            createdAt: new Date(
              Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
            ).toISOString(),
            updatedAt: new Date(
              Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 15
            ).toISOString(),
            scans: Math.floor(Math.random() * 100),
            title: index % 2 === 0 ? `QR Code ${index + 1}` : undefined,
            description:
              index % 3 === 0
                ? `Description for QR Code ${index + 1}`
                : undefined,
            customization:
              index % 2 === 0
                ? {
                    foregroundColor: [
                      "#000000",
                      "#1a73e8",
                      "#d32f2f",
                      "#388e3c",
                    ][index % 4],
                    backgroundColor: "#ffffff",
                    logoUrl:
                      index % 3 === 0
                        ? "https://placehold.co/50x50?text=Logo"
                        : undefined,
                    cornerRadius: index % 4 === 0 ? 8 : undefined,
                  }
                : undefined,
          }));

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setQrCodes(mockQrCodes);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch QR codes")
        );
        console.error("Failed to fetch QR codes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQrCodes();
  }, []);

  /**
   * Delete a QR Code
   * @param id - ID of QR Code to delete
   */
  const deleteQrCode = async (id: string) => {
    try {
      // This will be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setQrCodes((prevCodes) => prevCodes.filter((code) => code.id !== id));
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
    urlId: string,
    customization?: QrCode["customization"],
    title?: string,
    description?: string
  ) => {
    try {
      // This will be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newQrCode: QrCode = {
        id: `qr-new-${Date.now()}`,
        urlId,
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
      // This will be replaced with actual API call
      const mockQrCodes: QrCode[] = Array(6)
        .fill(null)
        .map((_, index) => ({
          id: `qr-${index + 1}`,
          urlId: `url-${index + 1}`,
          imageUrl: `https://placehold.co/200x200?text=QR+Code+${index + 1}`,
          createdAt: new Date(
            Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
          updatedAt: new Date(
            Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 15
          ).toISOString(),
          scans: Math.floor(Math.random() * 100),
          title: index % 2 === 0 ? `QR Code ${index + 1}` : undefined,
          description:
            index % 3 === 0
              ? `Description for QR Code ${index + 1}`
              : undefined,
          customization:
            index % 2 === 0
              ? {
                  foregroundColor: ["#000000", "#1a73e8", "#d32f2f", "#388e3c"][
                    index % 4
                  ],
                  backgroundColor: "#ffffff",
                  logoUrl:
                    index % 3 === 0
                      ? "https://placehold.co/50x50?text=Logo"
                      : undefined,
                  cornerRadius: index % 4 === 0 ? 8 : undefined,
                }
              : undefined,
        }));

      await new Promise((resolve) => setTimeout(resolve, 800));
      setQrCodes(mockQrCodes);
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
    deleteQrCode,
    generateQrCode,
    refreshQrCodes,
  };
};
