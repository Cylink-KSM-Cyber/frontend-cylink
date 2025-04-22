import { useState, useEffect } from "react";
import { fetchQrCodes } from "@/services/qrcode";
import { QrCodeStats } from "@/interfaces/qrcode";

/**
 * Custom hook for fetching QR code statistics
 * @returns QR code statistics and loading state
 */
export const useQrCodeStats = () => {
  const [stats, setStats] = useState<QrCodeStats>({
    total: 0,
    createdToday: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch total QR codes - we only need the pagination info, not all the data
        const response = await fetchQrCodes({
          page: 1,
          limit: 1, // Minimum to get pagination info
          includeUrl: false, // No need for detailed data
        });

        // Count of QR codes created today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch QR codes created today
        const todayResponse = await fetchQrCodes({
          page: 1,
          limit: 100, // Adjust as needed for your use case
          sortBy: "created_at",
          sortOrder: "desc",
          includeUrl: false,
        });

        // Filter QR codes created today
        const todayQrCodes = todayResponse.data.filter((qrCode) => {
          const createdAt = new Date(qrCode.created_at);
          createdAt.setHours(0, 0, 0, 0);
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
          return createdAt.getTime() === todayDate.getTime();
        });

        setStats({
          total: response.pagination.total,
          createdToday: todayQrCodes.length,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch QR code stats")
        );
        console.error("Failed to fetch QR code stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  /**
   * Refresh QR code statistics
   */
  const refreshStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch total QR codes
      const response = await fetchQrCodes({
        page: 1,
        limit: 1,
        includeUrl: false,
      });

      // Count of QR codes created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch QR codes created today
      const todayResponse = await fetchQrCodes({
        page: 1,
        limit: 100,
        sortBy: "created_at",
        sortOrder: "desc",
        includeUrl: false,
      });

      // Filter QR codes created today
      const todayQrCodes = todayResponse.data.filter((qrCode) => {
        const createdAt = new Date(qrCode.created_at);
        createdAt.setHours(0, 0, 0, 0);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        return createdAt.getTime() === todayDate.getTime();
      });

      setStats({
        total: response.pagination.total,
        createdToday: todayQrCodes.length,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh QR code stats")
      );
      console.error("Failed to refresh QR code stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  };
};
