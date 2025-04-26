"use client";

import { useState } from "react";
import { QrCode } from "@/interfaces/url";
import { useToast } from "@/contexts/ToastContext";

/**
 * Custom hook for handling individual QR code actions
 * @param deleteQrCode - Function to delete a QR code
 * @param refreshQrCodes - Function to refresh QR codes
 * @param removeFromSelection - Function to remove a QR code from selection
 * @returns Actions and state for QR code operations
 */
export const useQrCodeActions = (
  deleteQrCode: (id: string | number) => Promise<boolean>,
  refreshQrCodes: () => Promise<boolean>,
  removeFromSelection: (qrCodeId: number) => void
) => {
  const [isDeletingQrCode, setIsDeletingQrCode] = useState(false);
  const { showToast } = useToast();

  /**
   * Confirm QR code deletion
   * @param qrCode - QR code to delete
   */
  const confirmDeleteQrCode = async (qrCode: QrCode) => {
    if (!qrCode) return;

    setIsDeletingQrCode(true);
    try {
      const success = await deleteQrCode(qrCode.id);
      if (success) {
        // Remove from selected QR codes if present
        removeFromSelection(qrCode.id);

        // Wait for the modal to close and refresh the QR codes
        setTimeout(() => {
          refreshQrCodes();
        }, 500);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting QR code:", error);
      showToast("Failed to delete QR code", "error", 5000);
      return false;
    } finally {
      setIsDeletingQrCode(false);
    }
  };

  /**
   * Handle QR code update success
   */
  const handleQrCodeUpdated = () => {
    // Wait for the modal to close and refresh the QR codes
    setTimeout(() => {
      refreshQrCodes();
    }, 500);
  };

  /**
   * Handle QR code creation completion
   */
  const handleQrCodeCreated = () => {
    refreshQrCodes();
    showToast("QR code created successfully", "success", 3000);
  };

  return {
    isDeletingQrCode,
    setIsDeletingQrCode,
    confirmDeleteQrCode,
    handleQrCodeUpdated,
    handleQrCodeCreated,
  };
};
