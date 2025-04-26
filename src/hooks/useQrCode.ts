"use client";

import { useState, useCallback, useRef } from "react";
import {
  QrCodeColor,
  QrCodeGenerateRequest,
  QrCodeEditRequest,
  QrCodeUpdateResponse,
} from "@/interfaces/qrcode";
import { fetchQrCodeColors, generateQrCode } from "@/services/qrcode";
import { Url } from "@/interfaces/url";
import { useToast } from "@/contexts/ToastContext";

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
  const [includeLogoChecked, setIncludeLogoChecked] = useState<boolean>(false);
  const [logoSize, setLogoSize] = useState<number>(0.25); // Default 25%
  const [qrSize, setQrSize] = useState<number>(300); // Default size
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<string>("H");

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string | null>(null);

  // Refs to track API call status
  const colorsLoadedRef = useRef(false);
  const colorsFetchInProgressRef = useRef(false);

  // Toast context
  const { showToast } = useToast();

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
    // Skip if colors are already loaded or there's a fetch in progress
    if (
      (colorsLoadedRef.current &&
        foregroundColors.length > 0 &&
        backgroundColors.length > 0) ||
      colorsFetchInProgressRef.current
    ) {
      return;
    }

    colorsFetchInProgressRef.current = true;
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
      if (fgColors.length > 0 && !selectedForegroundColor) {
        setSelectedForegroundColor(fgColors[0]);
      }
      if (bgColors.length > 0 && !selectedBackgroundColor) {
        setSelectedBackgroundColor(bgColors[0]);
      }

      // Mark colors as loaded
      colorsLoadedRef.current = true;
    } catch (err) {
      console.error("Error loading QR code colors:", err);

      // Set default colors when API fails
      setForegroundColors([{ name: "Black", hex: "#000000" }]);
      setBackgroundColors([{ name: "White", hex: "#FFFFFF" }]);

      if (!selectedForegroundColor) {
        setSelectedForegroundColor({ name: "Black", hex: "#000000" });
      }
      if (!selectedBackgroundColor) {
        setSelectedBackgroundColor({ name: "White", hex: "#FFFFFF" });
      }

      setError(
        err instanceof Error ? err : new Error("Failed to load QR code colors")
      );
    } finally {
      setIsLoading(false);
      colorsFetchInProgressRef.current = false;
    }
  }, [
    foregroundColors.length,
    backgroundColors.length,
    selectedForegroundColor,
    selectedBackgroundColor,
  ]);

  /**
   * Force reload colors (useful if needed to refresh data)
   */
  const reloadColors = useCallback(() => {
    colorsLoadedRef.current = false;
    loadColors();
  }, [loadColors]);

  /**
   * Generate QR code for URL
   * @param url - URL to generate QR code for
   * @returns URL of generated QR code image or null if generation failed
   */
  const generateQrCodeForUrl = useCallback(
    async (url: Url) => {
      // Ensure we have colors selected
      setDefaultColorsIfNeeded();

      if (!selectedForegroundColor || !selectedBackgroundColor) {
        setError(new Error("Please select colors for your QR code"));
        return null;
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

        // Display success toast with white background
        showToast("QR Code berhasil dibuat", "white", 4000);

        return response.data.image_url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate QR code";

        setError(err instanceof Error ? err : new Error(errorMessage));

        // Display error toast
        showToast(errorMessage, "error", 4000);

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
      showToast,
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

  /**
   * Fetch single QR code by ID
   * @param id QR code ID
   * @returns Promise with QR code data or error
   */
  const fetchQrCodeById = async (
    id: string | number
  ): Promise<QrCodeUpdateResponse> => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/qr-codes/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any authentication headers if needed
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch QR code: ${res.status}`);
      }

      const data = await res.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
      throw err;
    }
  };

  /**
   * Update an existing QR code
   * @param id QR code ID
   * @param editData QR code data to update
   * @returns Promise with updated QR code data or error
   */
  const updateQrCode = async (
    id: string | number,
    editData: QrCodeEditRequest
  ): Promise<QrCodeUpdateResponse> => {
    setIsGenerating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/qr-codes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add any authentication headers if needed
          },
          body: JSON.stringify(editData),
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to update QR code: ${res.status}`);
      }

      const data = await res.json();
      setIsGenerating(false);
      return data;
    } catch (err) {
      setError(err as Error);
      setIsGenerating(false);
      throw err;
    }
  };

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
    reloadColors,
    generateQrCodeForUrl,
    resetQrCode,
    fetchQrCodeById,
    updateQrCode,
  };
};
