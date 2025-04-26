"use client";

import React from "react";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { QrCodeColor } from "@/interfaces/qrcode";
import { Url } from "@/interfaces/url";

/**
 * Props for QR Code Customization Step component
 */
interface QrCodeCustomizationStepProps {
  /**
   * URL to create QR code for
   */
  previewUrl: string;
  /**
   * Selected URL for QR code
   */
  selectedUrl: Url | null;
  /**
   * Original URL if creating new URL
   */
  originalUrl?: string;
  /**
   * Whether URL source is existing URL
   */
  isExistingUrl: boolean;
  /**
   * Whether QR code has been generated
   */
  isGenerated: boolean;
  /**
   * URL of generated QR code image
   */
  generatedQrUrl: string | null;
  /**
   * Whether QR code is being generated
   */
  isGenerating: boolean;
  /**
   * Whether colors are being loaded
   */
  isLoading: boolean;
  /**
   * Available foreground colors
   */
  foregroundColors: QrCodeColor[];
  /**
   * Available background colors
   */
  backgroundColors: QrCodeColor[];
  /**
   * Selected foreground color
   */
  selectedForegroundColor: QrCodeColor | null;
  /**
   * Selected background color
   */
  selectedBackgroundColor: QrCodeColor | null;
  /**
   * Whether to include logo
   */
  includeLogoChecked: boolean;
  /**
   * Logo size (0-1)
   */
  logoSize: number;
  /**
   * Error correction level (L, M, Q, H)
   */
  errorCorrectionLevel: string;
  /**
   * Set foreground color
   */
  setSelectedForegroundColor: (color: QrCodeColor) => void;
  /**
   * Set background color
   */
  setSelectedBackgroundColor: (color: QrCodeColor) => void;
  /**
   * Set whether to include logo
   */
  setIncludeLogoChecked: (checked: boolean) => void;
  /**
   * Set logo size
   */
  setLogoSize: (size: number) => void;
  /**
   * Set error correction level
   */
  setErrorCorrectionLevel: (level: string) => void;
}

/**
 * QR Code Customization Step Component
 *
 * @description Second step in QR code creation process for customizing QR code appearance
 */
const QrCodeCustomizationStep: React.FC<QrCodeCustomizationStepProps> = ({
  previewUrl,
  selectedUrl,
  originalUrl,
  isExistingUrl,
  isGenerated,
  generatedQrUrl,
  isGenerating,
  isLoading,
  foregroundColors,
  backgroundColors,
  selectedForegroundColor,
  selectedBackgroundColor,
  includeLogoChecked,
  logoSize,
  errorCorrectionLevel,
  setSelectedForegroundColor,
  setSelectedBackgroundColor,
  setIncludeLogoChecked,
  setLogoSize,
  setErrorCorrectionLevel,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* QR Code Preview */}
      <div className="flex items-center justify-center lg:w-1/2">
        <QrCodePreview
          foregroundColor={selectedForegroundColor?.hex || "#000000"}
          backgroundColor={selectedBackgroundColor?.hex || "#FFFFFF"}
          includeLogoChecked={includeLogoChecked}
          generatedQrUrl={generatedQrUrl}
          isLoading={isLoading || isGenerating}
          value={previewUrl}
          errorCorrectionLevel={errorCorrectionLevel as "L" | "M" | "Q" | "H"}
          size={280}
          logoSize={logoSize}
        />
      </div>

      {/* Customization Options */}
      <div className="lg:w-1/2">
        {!isGenerated ? (
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
              {includeLogoChecked && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600 mb-1">
                    Logo Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={logoSize * 100}
                    onChange={(e) => setLogoSize(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isLoading || isGenerating}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Correction Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "L",
                    label: "Low (7%)",
                    description: "Best for clean environments",
                  },
                  {
                    value: "M",
                    label: "Medium (15%)",
                    description: "Balanced recovery",
                  },
                  {
                    value: "Q",
                    label: "Quartile (25%)",
                    description: "Better recovery",
                  },
                  {
                    value: "H",
                    label: "High (30%)",
                    description: "Best with logo overlay",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setErrorCorrectionLevel(option.value)}
                    disabled={
                      isLoading ||
                      isGenerating ||
                      (includeLogoChecked && option.value !== "H")
                    }
                    className={`p-2 text-left text-sm rounded border ${
                      errorCorrectionLevel === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    } ${
                      includeLogoChecked && option.value !== "H"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
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
              <div className="text-sm font-medium text-black">{previewUrl}</div>

              <div className="text-xs font-medium text-gray-500 mt-3 mb-1">
                Original URL
              </div>
              <div className="text-sm text-gray-700 break-all">
                {(() => {
                  if (isExistingUrl && selectedUrl) {
                    const original = selectedUrl.original_url || "";
                    return original.length > 40
                      ? `${original.substring(0, 40)}...`
                      : original;
                  } else if (!isExistingUrl && originalUrl) {
                    return originalUrl.length > 40
                      ? `${originalUrl.substring(0, 40)}...`
                      : originalUrl;
                  }
                  return "";
                })()}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              QR Code Generated
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your QR code has been generated successfully. You can download it
              or share it using the buttons below.
            </p>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Short URL
              </div>
              <div className="text-sm font-medium text-black">{previewUrl}</div>

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
                  <div className="text-xs font-medium text-gray-500">Size</div>
                  <div className="text-sm text-gray-700">280×280px</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrCodeCustomizationStep;
