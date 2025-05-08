"use client";

import React, { useEffect, useRef } from "react";
import { QrCode } from "@/interfaces/url";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { useQrCode } from "@/hooks/useQrCode";
import { RiSaveLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { QrCodeEditRequest } from "@/interfaces/qrcode";

/**
 * QrCodeEditModal props
 * @interface QrCodeEditModalProps
 */
interface QrCodeEditModalProps {
  /** The QR code to edit */
  qrCode: QrCode | null;
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Function to call when modal is closed */
  onClose: () => void;
  /** Function to call when QR code is updated successfully */
  onUpdated?: () => void;
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
 * QrCodeEditModal Component
 * @description Modal for QR code editing with customization options
 */
const QrCodeEditModal: React.FC<QrCodeEditModalProps> = ({
  qrCode,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const router = useRouter();
  const qrUpdatedRef = useRef(false);

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
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    setErrorCorrectionLevel,
    loadColors,
    updateQrCode,
  } = useQrCode();

  // Track if initial values are set
  const initialValuesSetRef = useRef(false);

  // Load colors and set initial values when modal opens
  useEffect(() => {
    if (isOpen && qrCode && !initialValuesSetRef.current) {
      console.log("[QrCodeEditModal] Modal opened with QR code:", qrCode.id);
      console.log(
        "[QrCodeEditModal] Current customization:",
        qrCode.customization
      );

      // Prevent unnecessary re-renders by loading colors only once per modal open
      if (foregroundColors.length === 0 || backgroundColors.length === 0) {
        console.log("[QrCodeEditModal] Loading colors from API");
        loadColors();
      } else {
        console.log("[QrCodeEditModal] Colors already loaded:", {
          foregroundColors: foregroundColors.length,
          backgroundColors: backgroundColors.length,
        });
      }

      // Set initial values based on the QR code
      const fgColor = qrCode.customization?.foregroundColor || "#000000";
      const bgColor = qrCode.customization?.backgroundColor || "#FFFFFF";
      const includeLogo = qrCode.customization?.includeLogo || false;

      console.log("[QrCodeEditModal] Initial values:", {
        foregroundColor: fgColor,
        backgroundColor: bgColor,
        includeLogo: includeLogo,
      });

      // Find matching colors in the palette or use the first one
      if (foregroundColors.length > 0) {
        const matchedFgColor =
          foregroundColors.find((c) => c.hex === fgColor) ||
          foregroundColors[0];

        console.log(
          "[QrCodeEditModal] Setting initial foreground color:",
          matchedFgColor
        );
        setSelectedForegroundColor(matchedFgColor);
      }

      if (backgroundColors.length > 0) {
        const matchedBgColor =
          backgroundColors.find((c) => c.hex === bgColor) ||
          backgroundColors[0];

        console.log(
          "[QrCodeEditModal] Setting initial background color:",
          matchedBgColor
        );
        setSelectedBackgroundColor(matchedBgColor);
      }

      setIncludeLogoChecked(includeLogo);
      qrUpdatedRef.current = false;
      initialValuesSetRef.current = true;
    }

    // Reset initialValuesSetRef when modal closes
    if (!isOpen) {
      initialValuesSetRef.current = false;
    }
  }, [
    isOpen,
    qrCode,
    foregroundColors,
    backgroundColors,
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    loadColors,
  ]);

  // Effect to refresh page after QR update
  useEffect(() => {
    if (qrUpdatedRef.current) {
      // Refresh page after toast is shown (1.3 seconds)
      setTimeout(() => {
        router.refresh();
        if (onUpdated) {
          onUpdated();
        }
      }, 1300);
    }
  }, [qrUpdatedRef, router, onUpdated]);

  // Handle Update QR Code button click
  const handleUpdateClick = async () => {
    if (!qrCode) return;

    // Prepare edit data
    const editData: QrCodeEditRequest = {
      color: selectedForegroundColor?.hex || "#000000",
      background_color: selectedBackgroundColor?.hex || "#FFFFFF",
      include_logo: includeLogoChecked,
      logo_size: Math.round(0.25 * 100), // Convert decimal to integer percentage (25%)
      size: qrSize || 300,
    };

    console.log("QR Code update requested with data:", {
      id: qrCode.id,
      current_foreground: qrCode.customization?.foregroundColor,
      current_background: qrCode.customization?.backgroundColor,
      new_foreground: editData.color,
      new_background: editData.background_color,
      include_logo: editData.include_logo,
    });

    try {
      // Update QR code
      console.log("Sending update request to API...");
      const response = await updateQrCode(qrCode.id, editData);
      console.log("Update QR code response:", response);
      qrUpdatedRef.current = true;

      // Close modal after a short delay to show success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error updating QR code:", err);
    }
  };

  // Stabilize reference to avoid re-renders
  const memoizedValue = React.useMemo(() => {
    return qrCode?.shortUrl || `https://example.com/${qrCode?.id}`;
  }, [qrCode]);

  // Don't render if no QR code is provided
  if (!qrCode) return null;

  // Determine what footer buttons to show based on state
  const renderFooterButtons = () => {
    return (
      <>
        <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdateClick}
          disabled={
            isGenerating || !selectedForegroundColor || !selectedBackgroundColor
          }
          loading={isGenerating}
          startIcon={<RiSaveLine />}
        >
          {isGenerating ? "Updating..." : "Update QR Code"}
        </Button>
      </>
    );
  };

  return (
    <Modal
      title="Edit QR Code"
      isOpen={isOpen}
      onClose={() => {
        // Reset state sebelum menutup modal
        initialValuesSetRef.current = false;
        onClose();
      }}
      variant="default"
      size="md"
      footer={renderFooterButtons()}
      overlayStyle="glassmorphism"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* QR Code Preview - Make more compact */}
          <div className="flex items-center justify-center md:w-2/5">
            <QrCodePreview
              key={`${selectedForegroundColor?.hex}-${selectedBackgroundColor?.hex}-${includeLogoChecked}`}
              foregroundColor={selectedForegroundColor?.hex || "#000000"}
              backgroundColor={selectedBackgroundColor?.hex || "#FFFFFF"}
              includeLogoChecked={includeLogoChecked}
              isLoading={isLoading || isGenerating}
              value={memoizedValue}
              errorCorrectionLevel={
                errorCorrectionLevel as "L" | "M" | "Q" | "H"
              }
              size={220} // Fixed size for preview only, doesn't affect the actual QR size
              logoSize={0.25} // Fixed logo size ratio for preview
            />
          </div>

          {/* Customization Options - More compact layout */}
          <div className="md:w-3/5">
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Customize QR Code
              </h3>

              {/* Make spacing more compact */}
              <div className="grid grid-cols-2 gap-4">
                {/* Foreground Color Selection */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Foreground Color
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {foregroundColors.slice(0, 6).map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedForegroundColor?.hex === color.hex
                            ? "border-blue-500 shadow-md scale-110"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => {
                          console.log(
                            "Foreground color clicked:",
                            color.name,
                            color.hex
                          );
                          setSelectedForegroundColor(color);
                        }}
                        disabled={isLoading || isGenerating}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>

                {/* Background Color Selection */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {backgroundColors.slice(0, 6).map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedBackgroundColor?.hex === color.hex
                            ? "border-blue-500 shadow-md scale-110"
                            : "border-gray-200"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => {
                          console.log(
                            "Background color clicked:",
                            color.name,
                            color.hex
                          );
                          setSelectedBackgroundColor(color);
                        }}
                        disabled={isLoading || isGenerating}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo Inclusion Toggle */}
              <div className="mb-3">
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

              {/* Error Correction Level - Make more compact */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Correction Level
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {ERROR_CORRECTION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setErrorCorrectionLevel(option.value)}
                      disabled={isLoading || isGenerating}
                      className={`p-1 text-left text-xs rounded border ${
                        errorCorrectionLevel === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code Info - Make more compact */}
              <div className="mt-3 p-2 bg-gray-50 rounded-md">
                <div className="text-xs font-medium text-gray-500">
                  Short URL:{" "}
                  <span className="text-black">{qrCode.shortUrl}</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded-md">
                  {error.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QrCodeEditModal;
