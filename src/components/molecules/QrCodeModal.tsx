"use client";

import React, { useEffect, useRef } from "react";
import { Url } from "@/interfaces/url";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { useQrCode } from "@/hooks/useQrCode";
import { RiQrCodeLine, RiDownload2Line, RiShareLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import posthogClient from "@/utils/posthogClient";
import { useConversionTracking } from "@/hooks/useConversionTracking";

/**
 * QrCodeModal props
 * @interface QrCodeModalProps
 */
interface QrCodeModalProps {
  /** The URL to generate QR code for */
  url: Url | null;
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when modal is closed */
  onClose: () => void;
}

/**
 * Error correction level options
 */
const ERROR_CORRECTION_OPTIONS = [
  { value: "L", label: "Low (7%)", description: "Best for clean environments" },
  { value: "M", label: "Medium (15%)", description: "Balanced recovery" },
  { value: "Q", label: "Quartile (25%)", description: "Better recovery" },
  { value: "H", label: "High (30%)", description: "Best with logo overlay" },
];

/**
 * QrCodeModal Component
 * @description Modal for QR code generation with customization options
 */
const QrCodeModal: React.FC<QrCodeModalProps> = ({ url, isOpen, onClose }) => {
  const router = useRouter();
  const qrGeneratedRef = useRef(false);
  const { trackQrCodeSharing } = useConversionTracking();

  const {
    foregroundColors,
    backgroundColors,
    selectedForegroundColor,
    selectedBackgroundColor,
    includeLogoChecked,
    errorCorrectionLevel,
    qrSize,
    isLoading,
    isGenerating,
    error,
    generatedQrUrl,
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    setErrorCorrectionLevel,
    loadColors,
    generateQrCodeForUrl,
    resetQrCode,
  } = useQrCode();

  // Load colors when modal opens
  useEffect(() => {
    if (isOpen) {
      loadColors();
      resetQrCode();
      qrGeneratedRef.current = false;
    }
  }, [isOpen, loadColors, resetQrCode]);

  // Effect to refresh page after QR generation
  useEffect(() => {
    if (generatedQrUrl && !qrGeneratedRef.current) {
      qrGeneratedRef.current = true;
      // Refresh page after toast is shown (1.3 seconds)
      setTimeout(() => {
        router.refresh();
      }, 1300);
    }
  }, [generatedQrUrl, router]);

  // Handle Generate QR Code button click
  const handleGenerateClick = async () => {
    if (!url) return;
    await generateQrCodeForUrl(url);
  };

  // Handle Download QR Code button click
  const handleDownloadClick = () => {
    if (!generatedQrUrl || !url) return;

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = generatedQrUrl;
    a.download = `qrcode-${url.short_code || "link"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Track QR code download for newly generated QR codes
    // Note: This is a simplified tracking since we don't have full QR code data
    // In a real scenario, you might want to track this differently
    posthogClient.captureEvent("qr_code_downloaded", {
      url_id: url.id,
      qr_code_title: url.title || `QR Code for ${url.short_code}`,
      short_url: url.short_url,
      download_format: "png",
      download_size: qrSize,
      includes_logo: includeLogoChecked,
      download_method: "individual",
      success: true,
    });
  };

  // Handle Share QR Code button click
  const handleShareClick = async () => {
    if (!generatedQrUrl || !url) return;

    // Determine sharing platform
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    const sharingPlatform = isMobile ? "mobile" : "desktop";

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${url.short_url}`,
          text: `Scan this QR code to visit ${url.short_url}`,
          url: url.short_url,
        });

        // Track successful QR code sharing via Web Share API
        trackQrCodeSharing({
          qr_code_id: url.id, // Using URL ID as QR code ID for this context
          url_id: url.id,
          qr_code_title: url.title || `QR Code for ${url.short_code}`,
          short_url: url.short_url,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "web_share_api",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0, // Not available in this context
          qr_code_age_days: 0, // Not available in this context
          success: true,
        });
      } catch (err) {
        console.error("Error sharing:", err);

        // Track failed QR code sharing
        trackQrCodeSharing({
          qr_code_id: url.id,
          url_id: url.id,
          qr_code_title: url.title || `QR Code for ${url.short_code}`,
          short_url: url.short_url,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "web_share_api",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0,
          qr_code_age_days: 0,
          success: false,
          error_message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url.short_url);
        alert("URL copied to clipboard!");

        // Track successful QR code sharing via clipboard
        trackQrCodeSharing({
          qr_code_id: url.id,
          url_id: url.id,
          qr_code_title: url.title || `QR Code for ${url.short_code}`,
          short_url: url.short_url,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "clipboard",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0,
          qr_code_age_days: 0,
          success: true,
        });
      } catch (err) {
        console.error("Error copying to clipboard:", err);

        // Track failed clipboard sharing
        trackQrCodeSharing({
          qr_code_id: url.id,
          url_id: url.id,
          qr_code_title: url.title || `QR Code for ${url.short_code}`,
          short_url: url.short_url,
          customization_options: {
            foreground_color: selectedForegroundColor?.hex || "#000000",
            background_color: selectedBackgroundColor?.hex || "#FFFFFF",
            size: qrSize,
          },
          sharing_method: "clipboard",
          sharing_platform: sharingPlatform,
          includes_logo: includeLogoChecked,
          total_scans: 0,
          qr_code_age_days: 0,
          success: false,
          error_message: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }
  };

  // Don't render if no URL is provided
  if (!url) return null;

  // Determine what footer buttons to show based on state
  const renderFooterButtons = () => {
    if (generatedQrUrl) {
      return (
        <>
          <Button
            variant="secondary"
            onClick={resetQrCode}
            startIcon={<RiQrCodeLine />}
          >
            Customize Again
          </Button>
          <Button
            variant="primary"
            onClick={handleDownloadClick}
            startIcon={<RiDownload2Line />}
          >
            Download
          </Button>
          <Button
            variant="primary"
            onClick={handleShareClick}
            startIcon={<RiShareLine />}
          >
            Share
          </Button>
        </>
      );
    }

    return (
      <>
        <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleGenerateClick}
          disabled={
            isGenerating || !selectedForegroundColor || !selectedBackgroundColor
          }
          loading={isGenerating}
          startIcon={<RiQrCodeLine />}
        >
          {isGenerating ? "Generating..." : "Generate QR Code"}
        </Button>
      </>
    );
  };

  return (
    <Modal
      title="Generate QR Code"
      isOpen={isOpen}
      onClose={onClose}
      variant="default"
      size="lg"
      footer={renderFooterButtons()}
      overlayStyle="glassmorphism"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* QR Code Preview */}
        <div className="flex items-center justify-center lg:w-1/2">
          <QrCodePreview
            foregroundColor={selectedForegroundColor?.hex || "#000000"}
            backgroundColor={selectedBackgroundColor?.hex || "#FFFFFF"}
            includeLogoChecked={includeLogoChecked}
            generatedQrUrl={generatedQrUrl}
            isLoading={isLoading || isGenerating}
            value={url.short_url}
            errorCorrectionLevel={errorCorrectionLevel as "L" | "M" | "Q" | "H"}
            size={280}
            logoSize={0.25}
          />
        </div>

        {/* Customization Options */}
        <div className="lg:w-1/2">
          {!generatedQrUrl ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Customize Your QR Code
              </h3>

              {/* Foreground Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {foregroundColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedForegroundColor?.hex === color.hex
                          ? "border-blue-500 shadow-md scale-110"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedForegroundColor(color)}
                      disabled={isLoading || isGenerating}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedBackgroundColor?.hex === color.hex
                          ? "border-blue-500 shadow-md scale-110"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedBackgroundColor(color)}
                      disabled={isLoading || isGenerating}
                      title={color.name}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>

              {/* Logo Inclusion Toggle */}
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLogoChecked}
                    onChange={(e) => setIncludeLogoChecked(e.target.checked)}
                    disabled={isLoading || isGenerating}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Include KSM Logo
                  </span>
                </label>
              </div>

              {/* Error Correction Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ERROR_CORRECTION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setErrorCorrectionLevel(option.value)}
                      disabled={isLoading || isGenerating}
                      className={`p-2 text-left text-sm rounded border ${
                        errorCorrectionLevel === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Info */}
              <div className="mt-6 p-3 bg-gray-50 rounded-md">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Short URL
                </div>
                <div className="text-sm font-medium text-black">
                  {url.short_url}
                </div>

                <div className="text-xs font-medium text-gray-500 mt-3 mb-1">
                  Original URL
                </div>
                <div className="text-sm text-gray-700 break-all">
                  {url.original_url.length > 40
                    ? `${url.original_url.substring(0, 40)}...`
                    : url.original_url}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-2 bg-red-50 text-red-600 text-sm rounded-md">
                  {error.message}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                QR Code Generated
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your QR code has been generated successfully. You can download
                it or share it using the buttons below.
              </p>

              <div className="p-3 bg-gray-50 rounded-md">
                <div className="text-xs font-medium text-gray-500 mb-1">
                  Short URL
                </div>
                <div className="text-sm font-medium text-black">
                  {url.short_url}
                </div>

                <div className="flex justify-between mt-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Created
                    </div>
                    <div className="text-sm text-gray-700">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Size
                    </div>
                    <div className="text-sm text-gray-700">
                      {qrSize}×{qrSize}px
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default QrCodeModal;
