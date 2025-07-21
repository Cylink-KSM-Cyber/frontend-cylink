"use client";

import { useToast } from "@/contexts/ToastContext";
import { QrCode } from "@/interfaces/url";
import { qrCodeDownloadService } from "@/services/qrCodeDownloadService";
import { useConversionTracking } from "@/hooks/useConversionTracking";

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
  const { trackQrCodeBulkOperation } = useConversionTracking();

  /**
   * Handle bulk delete QR codes
   * @param selectedQrCodes - Array of selected QR codes to delete
   */
  const handleBulkDeleteQrCodes = async (selectedQrCodes: QrCode[]) => {
    if (selectedQrCodes.length === 0) return;

    // Confirm before proceeding
    if (window.confirm(`Delete ${selectedQrCodes.length} selected QR codes?`)) {
      const startTime = Date.now();
      let successCount = 0;
      let failedCount = 0;

      for (const qrCode of selectedQrCodes) {
        try {
          const success = await deleteQrCode(
            qrCode.id,
            "bulk",
            "Bulk deletion"
          );
          if (success) successCount++;
          else failedCount++;
        } catch (error) {
          console.error(`Error deleting QR code ${qrCode.id}:`, error);
          failedCount++;
        }
      }

      // Calculate operation metrics
      const operationDuration = Date.now() - startTime;
      const totalScans = selectedQrCodes.reduce(
        (sum, qrCode) => sum + (qrCode.scans || 0),
        0
      );
      const averageAge =
        selectedQrCodes.reduce((sum, qrCode) => {
          const age = Math.floor(
            (Date.now() - new Date(qrCode.createdAt).getTime()) /
              (1000 * 60 * 60 * 24)
          );
          return sum + age;
        }, 0) / selectedQrCodes.length;
      const qrCodesWithLogos = selectedQrCodes.filter(
        (qrCode) => qrCode.customization?.includeLogo
      ).length;

      // Track bulk delete operation
      trackQrCodeBulkOperation({
        operation_type: "bulk_delete",
        qr_codes_count: selectedQrCodes.length,
        qr_code_ids: selectedQrCodes.map((qrCode) => qrCode.id),
        url_ids: selectedQrCodes.map((qrCode) => qrCode.urlId),
        qr_code_titles: selectedQrCodes.map(
          (qrCode) => qrCode.title || `QR Code ${qrCode.id}`
        ),
        short_urls: selectedQrCodes.map((qrCode) => qrCode.shortUrl || ""),
        deletion_method: "sequential",
        deletion_reason: "Bulk deletion",
        customization_options: selectedQrCodes.map((qrCode) => ({
          foreground_color: qrCode.customization?.foregroundColor || "#000000",
          background_color: qrCode.customization?.backgroundColor || "#FFFFFF",
          size: qrCode.customization?.size || 300,
        })),
        total_scans: totalScans,
        average_qr_code_age_days: Math.round(averageAge),
        qr_codes_with_logos: qrCodesWithLogos,
        success: successCount > 0,
        success_count: successCount,
        failed_count: failedCount,
        operation_duration_ms: operationDuration,
        ui_source: "bulk_actions_panel",
      });

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
        format,
        "individual"
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

  /**
   * Handle bulk download QR codes
   * @param selectedQrCodes - Array of selected QR codes to download
   * @param format - Format to download (png or svg)
   */
  const handleBulkDownloadQrCodes = async (
    selectedQrCodes: QrCode[],
    format: "png" | "svg" = "png"
  ) => {
    if (selectedQrCodes.length === 0) return;

    try {
      showToast(
        `Preparing bulk download of ${selectedQrCodes.length} QR codes...`,
        "info",
        2000
      );

      const success = await qrCodeDownloadService.downloadBulkQrCodes(
        selectedQrCodes,
        format,
        "bulk_actions_panel"
      );

      if (success) {
        showToast(
          `${selectedQrCodes.length} QR codes downloaded successfully`,
          "success",
          3000
        );
      } else {
        showToast(
          `Failed to download some QR codes. Please try again.`,
          "error",
          5000
        );
      }
    } catch (error) {
      showToast(
        `Error downloading QR codes: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error",
        5000
      );
    }
  };

  return {
    handleBulkDeleteQrCodes,
    handleDownloadQrCode,
    handleBulkDownloadQrCodes,
  };
};
