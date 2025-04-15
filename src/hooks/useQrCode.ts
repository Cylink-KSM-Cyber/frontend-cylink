"use client";

import { useState, useCallback } from "react";
import { QrCodeColor, QrCodeGenerateRequest } from "@/interfaces/qrcode";
import { fetchQrCodeColors, generateQrCode } from "@/services/qrcode";
import { Url } from "@/interfaces/url";

/**
 * Default QR code foreground and background colors
 */
const DEFAULT_COLORS = {
  foreground: "#000000", // Black
  background: "#FFFFFF", // White
};

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
  const [logoSize, setLogoSize] = useState<number>(0.25); // Default 25%
  const [qrSize, setQrSize] = useState<number>(300); // Default 300px
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<string>("H"); // Default highest correction

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string | null>(null);

  /**
   * Set default colors when no API colors are available
   */
  const setDefaultColorsIfNeeded = useCallback(() => {
    // If no foreground color is selected, create a default black one
    if (!selectedForegroundColor) {
      setSelectedForegroundColor({
        name: "Black",
        hex: DEFAULT_COLORS.foreground,
      });
    }

    // If no background color is selected, create a default white one
    if (!selectedBackgroundColor) {
      setSelectedBackgroundColor({
        name: "White",
        hex: DEFAULT_COLORS.background,
      });
    }
  }, [selectedForegroundColor, selectedBackgroundColor]);

  /**
   * Load available QR code colors
   */
  const loadColors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchQrCodeColors();

      // If API returns empty arrays, add at least black and white options
      const fgColors =
        response.data.foreground_colors.length > 0
          ? response.data.foreground_colors
          : [{ name: "Black", hex: "#000000" }];

      const bgColors =
        response.data.background_colors.length > 0
          ? response.data.background_colors
          : [{ name: "White", hex: "#FFFFFF" }];

      setForegroundColors(fgColors);
      setBackgroundColors(bgColors);

      // Set defaults
      if (fgColors.length > 0) {
        setSelectedForegroundColor(fgColors[0]);
      }
      if (bgColors.length > 0) {
        setSelectedBackgroundColor(bgColors[0]);
      }
    } catch (err) {
      console.error("Error loading QR code colors:", err);

      // Set default colors when API fails
      setForegroundColors([{ name: "Black", hex: "#000000" }]);
      setBackgroundColors([{ name: "White", hex: "#FFFFFF" }]);
      setSelectedForegroundColor({ name: "Black", hex: "#000000" });
      setSelectedBackgroundColor({ name: "White", hex: "#FFFFFF" });

      setError(
        err instanceof Error ? err : new Error("Failed to load QR code colors")
      );
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
      // Ensure we have colors selected
      setDefaultColorsIfNeeded();

      if (!selectedForegroundColor || !selectedBackgroundColor) {
        setError(new Error("Please select colors for your QR code"));
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // Convert logo_size from decimal (0.25) to integer percentage (25)
        const logoSizePercentage = Math.round(logoSize * 100);

        const requestData: QrCodeGenerateRequest = {
          url_id: url.id,
          short_code: url.short_code,
          color: selectedForegroundColor.hex,
          background_color: selectedBackgroundColor.hex,
          include_logo: includeLogoChecked,
          logo_size: logoSizePercentage, // Send as integer percentage
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
      setDefaultColorsIfNeeded,
    ]
  );

  /**
   * Reset QR code state
   */
  const resetQrCode = useCallback(() => {
    setGeneratedQrUrl(null);
    setError(null);
    // Keep the selected colors and options
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
    errorCorrectionLevel,
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
    setErrorCorrectionLevel,

    // Actions
    loadColors,
    generateQrCodeForUrl,
    resetQrCode,
  };
};
