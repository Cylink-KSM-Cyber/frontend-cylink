"use client";

import { useState } from "react";
import { QrCode } from "@/interfaces/url";

/**
 * Custom hook for handling QR code selection for bulk actions
 * @param qrCodes - Array of QR codes available for selection
 * @returns Selection state and handlers
 */
export const useQrCodeSelection = (qrCodes: QrCode[]) => {
  // QR code selection for bulk actions
  const [selectedQrCodes, setSelectedQrCodes] = useState<QrCode[]>([]);

  /**
   * Handle QR code selection for bulk actions
   * @param qrCode - QR code to select or deselect
   * @param selected - Whether the QR code should be selected
   */
  const handleSelectQrCode = (qrCode: QrCode, selected: boolean) => {
    if (selected) {
      setSelectedQrCodes((prev) => [...prev, qrCode]);
    } else {
      setSelectedQrCodes((prev) =>
        prev.filter((code) => code.id !== qrCode.id)
      );
    }
  };

  /**
   * Handle select all QR codes
   * @param selected - Whether all QR codes should be selected
   */
  const handleSelectAllQrCodes = (selected: boolean) => {
    if (selected) {
      setSelectedQrCodes(qrCodes);
    } else {
      setSelectedQrCodes([]);
    }
  };

  /**
   * Clear selected QR codes
   */
  const clearSelection = () => {
    setSelectedQrCodes([]);
  };

  /**
   * Remove a QR code from the selection
   * @param qrCodeId - ID of the QR code to remove from selection
   */
  const removeFromSelection = (qrCodeId: number) => {
    setSelectedQrCodes((prev) => prev.filter((code) => code.id !== qrCodeId));
  };

  return {
    selectedQrCodes,
    handleSelectQrCode,
    handleSelectAllQrCodes,
    clearSelection,
    removeFromSelection,
  };
};
