"use client";

import { useToast } from "@/contexts/ToastContext";
import { QrCode } from "@/interfaces/url";

/**
 * Custom hook for handling QR code bulk actions
 * @param deleteQrCode - Function to delete a single QR code
 * @param refreshQrCodes - Function to refresh QR codes
 * @param clearSelection - Function to clear selected QR codes
 * @returns Bulk action handlers
 */
export const useQrCodeBulkActions = (
  deleteQrCode: (id: string | number) => Promise<boolean>,
  refreshQrCodes: () => Promise<boolean>,
  clearSelection: () => void
) => {
  const { showToast } = useToast();

  /**
   * Handle bulk delete QR codes
   * @param selectedQrCodes - Array of selected QR codes to delete
   */
  const handleBulkDeleteQrCodes = async (selectedQrCodes: QrCode[]) => {
    if (selectedQrCodes.length === 0) return;

    // Confirm before proceeding
    if (window.confirm(`Delete ${selectedQrCodes.length} selected QR codes?`)) {
      let successCount = 0;

      for (const qrCode of selectedQrCodes) {
        try {
          const success = await deleteQrCode(qrCode.id);
          if (success) successCount++;
        } catch (error) {
          console.error(`Error deleting QR code ${qrCode.id}:`, error);
        }
      }

      if (successCount > 0) {
        showToast(
          `${successCount} QR codes deleted successfully`,
          "success",
          3000
        );
        clearSelection();
        refreshQrCodes();
      }
    }
  };

  /**
   * Handle download QR code
   * @param qrCode - QR code to download
   * @param format - Format to download (png or svg)
   */
  const handleDownloadQrCode = (qrCode: QrCode, format: "png" | "svg") => {
    // This will be handled in the preview modal, but we can implement a direct download here
    if (qrCode.shortUrl) {
      // For demonstration, let's show a toast
      showToast(
        `Downloading QR code for ${qrCode.shortUrl} as ${format}`,
        "info",
        3000
      );
    }
  };

  return {
    handleBulkDeleteQrCodes,
    handleDownloadQrCode,
  };
};
