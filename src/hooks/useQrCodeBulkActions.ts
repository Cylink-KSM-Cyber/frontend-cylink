"use client";

import { useToast } from "@/contexts/ToastContext";
import { QrCode } from "@/interfaces/url";
import { qrCodeDownloadService } from "@/services/qrCodeDownloadService";

/**
 * Custom hook for handling QR code bulk actions
 * @param deleteQrCode - Function to delete a single QR code
 * @param refreshQrCodes - Function to refresh QR codes
 * @param clearSelection - Function to clear selected QR codes
 * @returns Bulk action handlers
 */
export const useQrCodeBulkActions = (
  deleteQrCode: (
    id: string | number,
    deletionMethod?: "manual" | "bulk",
    deletionReason?: string
  ) => Promise<boolean>,
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
          const success = await deleteQrCode(
            qrCode.id,
            "bulk",
            "Bulk deletion"
          );
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
  const handleDownloadQrCode = async (
    qrCode: QrCode,
    format: "png" | "svg" = "png"
  ) => {
    try {
      showToast(`Preparing QR code download...`, "info", 2000);

      const success = await qrCodeDownloadService.downloadQrCode(
        qrCode,
        format
      );

      if (success) {
        showToast(`QR code downloaded successfully`, "success", 3000);
      } else {
        showToast(
          `Failed to download QR code. Please try again.`,
          "error",
          5000
        );
      }
    } catch (error) {
      showToast(
        `Error downloading QR code: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error",
        5000
      );
    }
  };

  return { handleBulkDeleteQrCodes, handleDownloadQrCode };
};
