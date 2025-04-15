"use client";

import { useState, useCallback } from "react";
import { QrCodeColor, QrCodeGenerateRequest } from "@/interfaces/qrcode";
import { fetchQrCodeColors, generateQrCode } from "@/services/qrcode";
import { Url } from "@/interfaces/url";

/**
 * Custom hook for managing QR code operations
 * @returns QR code state and management functions
 */
export const useQrCode = () => {
  // State for colors
  const [foregroundColors, setForegroundColors] = useState<QrCodeColor[]>([]);
  const [backgroundColors, setBackgroundColors] = useState<QrCodeColor[]>([]);

  // State for selected options
  const [selectedForegroundColor, setSelectedForegroundColor] =
    useState<QrCodeColor | null>(null);
  const [selectedBackgroundColor, setSelectedBackgroundColor] =
    useState<QrCodeColor | null>(null);
  const [includeLogoChecked, setIncludeLogoChecked] = useState<boolean>(true);
  const [logoSize, setLogoSize] = useState<number>(0.2); // Default 20%
  const [qrSize, setQrSize] = useState<number>(300); // Default 300px

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string | null>(null);

  /**
   * Load available QR code colors
   */
  const loadColors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchQrCodeColors();
      setForegroundColors(response.data.foreground_colors);
      setBackgroundColors(response.data.background_colors);

      // Set defaults
      if (response.data.foreground_colors.length > 0) {
        setSelectedForegroundColor(response.data.foreground_colors[0]);
      }
      if (response.data.background_colors.length > 0) {
        setSelectedBackgroundColor(response.data.background_colors[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load QR code colors")
      );
      console.error("Error loading QR code colors:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate QR code for URL
   * @param url - URL to generate QR code for
   */
  const generateQrCodeForUrl = useCallback(
    async (url: Url) => {
      if (!selectedForegroundColor || !selectedBackgroundColor) {
        setError(new Error("Please select colors for your QR code"));
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const requestData: QrCodeGenerateRequest = {
          url_id: url.id,
          short_code: url.short_code,
          color: selectedForegroundColor.hex,
          background_color: selectedBackgroundColor.hex,
          include_logo: includeLogoChecked,
          logo_size: logoSize,
          size: qrSize,
        };

        const response = await generateQrCode(requestData);
        setGeneratedQrUrl(response.data.image_url);
        return response.data.image_url;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to generate QR code")
        );
        console.error("Error generating QR code:", err);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [
      selectedForegroundColor,
      selectedBackgroundColor,
      includeLogoChecked,
      logoSize,
      qrSize,
    ]
  );

  /**
   * Reset QR code state
   */
  const resetQrCode = useCallback(() => {
    setGeneratedQrUrl(null);
    setError(null);
  }, []);

  return {
    // State
    foregroundColors,
    backgroundColors,
    selectedForegroundColor,
    selectedBackgroundColor,
    includeLogoChecked,
    logoSize,
    qrSize,
    isLoading,
    isGenerating,
    error,
    generatedQrUrl,

    // Setters
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    setLogoSize,
    setQrSize,

    // Actions
    loadColors,
    generateQrCodeForUrl,
    resetQrCode,
  };
};
