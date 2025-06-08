"use client";

import React, { useState } from "react";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { QrCodeColor } from "@/interfaces/qrcode";
import { Url } from "@/interfaces/url";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";

/**
 * QR Code size options
 */
const QR_SIZE_OPTIONS = [
  { value: 200, label: "Small", size: "200×200px" },
  { value: 280, label: "Medium", size: "280×280px" },
  { value: 400, label: "Large", size: "400×400px" },
];

/**
 * Preset color options for easy selection
 */
const PRESET_FOREGROUND_COLORS = [
  { hex: "#000000", name: "Black" },
  { hex: "#1F2937", name: "Dark Gray" },
  { hex: "#3B82F6", name: "Blue" },
  { hex: "#EF4444", name: "Red" },
  { hex: "#10B981", name: "Green" },
  { hex: "#8B5CF6", name: "Purple" },
];

const PRESET_BACKGROUND_COLORS = [
  { hex: "#FFFFFF", name: "White" },
  { hex: "#F9FAFB", name: "Light Gray" },
  { hex: "#EBF8FF", name: "Light Blue" },
  { hex: "#FEF2F2", name: "Light Red" },
  { hex: "#ECFDF5", name: "Light Green" },
  { hex: "#FAF5FF", name: "Light Purple" },
];

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
   * QR Code size
   */
  qrSize: number;
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
   * Set QR code size
   */
  setQrSize?: (size: number) => void;
}

/**
 * QR Code Customization Step Component
 *
 * @description Second step in QR code creation process for customizing QR code appearance with simplified options
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
  qrSize = 280,
  setSelectedForegroundColor,
  setSelectedBackgroundColor,
  setIncludeLogoChecked,
  setLogoSize,
  setQrSize,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customForeground, setCustomForeground] = useState("#000000");
  const [customBackground, setCustomBackground] = useState("#FFFFFF");

  // Handle preset color selection
  const handlePresetForegroundSelect = (
    colorHex: string,
    colorName: string
  ) => {
    const colorObj = { hex: colorHex, name: colorName, id: 0 };
    setSelectedForegroundColor(colorObj);
  };

  const handlePresetBackgroundSelect = (
    colorHex: string,
    colorName: string
  ) => {
    const colorObj = { hex: colorHex, name: colorName, id: 0 };
    setSelectedBackgroundColor(colorObj);
  };

  // Handle custom color selection
  const handleCustomForegroundChange = (colorHex: string) => {
    setCustomForeground(colorHex);
    const colorObj = { hex: colorHex, name: "Custom", id: 0 };
    setSelectedForegroundColor(colorObj);
  };

  const handleCustomBackgroundChange = (colorHex: string) => {
    setCustomBackground(colorHex);
    const colorObj = { hex: colorHex, name: "Custom", id: 0 };
    setSelectedBackgroundColor(colorObj);
  };

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
          errorCorrectionLevel="M" // Always use Medium 15% as smart default
          size={280} // Fixed preview size
          logoSize={logoSize}
        />
      </div>

      {/* Customization Options */}
      <div className="lg:w-1/2">
        {!isGenerated ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Customize Your QR Code
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Customize colors, logo, and size to match your brand
              </p>
            </div>

            {/* Selected URL Display - More Prominent */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <RiCheckboxCircleFill className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    Selected URL
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {isExistingUrl && selectedUrl
                      ? selectedUrl.title || `URL ${selectedUrl.id}`
                      : "New URL"}
                  </div>
                  <div className="text-xs text-blue-700 font-mono bg-blue-100 inline-block px-2 py-1 rounded mt-2">
                    {previewUrl}
                  </div>
                </div>
              </div>
            </div>

            {/* Essential Options */}
            <div className="space-y-6">
              {/* Foreground Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Foreground Color
                </label>
                <div className="space-y-3">
                  {/* Preset Colors */}
                  <div className="flex flex-wrap gap-2">
                    {PRESET_FOREGROUND_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          selectedForegroundColor?.hex === color.hex
                            ? "border-blue-500 shadow-md scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() =>
                          handlePresetForegroundSelect(color.hex, color.name)
                        }
                        disabled={isLoading || isGenerating}
                        title={color.name}
                        aria-label={`Select ${color.name} foreground color`}
                      />
                    ))}
                  </div>

                  {/* Custom Color Option */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customForeground}
                      onChange={(e) =>
                        handleCustomForegroundChange(e.target.value)
                      }
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                      disabled={isLoading || isGenerating}
                      title="Custom foreground color"
                    />
                    <span className="text-sm text-gray-600">Custom color</span>
                  </div>
                </div>
              </div>

              {/* Background Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Background Color
                </label>
                <div className="space-y-3">
                  {/* Preset Colors */}
                  <div className="flex flex-wrap gap-2">
                    {PRESET_BACKGROUND_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          selectedBackgroundColor?.hex === color.hex
                            ? "border-blue-500 shadow-md scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() =>
                          handlePresetBackgroundSelect(color.hex, color.name)
                        }
                        disabled={isLoading || isGenerating}
                        title={color.name}
                        aria-label={`Select ${color.name} background color`}
                      />
                    ))}
                  </div>

                  {/* Custom Color Option */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBackground}
                      onChange={(e) =>
                        handleCustomBackgroundChange(e.target.value)
                      }
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                      disabled={isLoading || isGenerating}
                      title="Custom background color"
                    />
                    <span className="text-sm text-gray-600">Custom color</span>
                  </div>
                </div>
              </div>

              {/* Logo Inclusion Toggle */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLogoChecked}
                    onChange={(e) => setIncludeLogoChecked(e.target.checked)}
                    disabled={isLoading || isGenerating}
                    className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Include KSM Logo
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                  Add your brand logo to the center of the QR code
                </p>
              </div>

              {/* QR Code Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  QR Code Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {QR_SIZE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setQrSize?.(option.value)}
                      disabled={isLoading || isGenerating}
                      className={`p-3 text-center rounded-lg border transition-all ${
                        qrSize === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {option.size}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Settings (Collapsible) with Subtle Divider */}
            <div className="relative">
              {/* Subtle Divider Line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>Advanced Settings</span>
                  {showAdvanced ? (
                    <RiArrowUpSLine className="w-4 h-4 transition-transform" />
                  ) : (
                    <RiArrowDownSLine className="w-4 h-4 transition-transform" />
                  )}
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Logo Size (only if logo is enabled) */}
                    {includeLogoChecked && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Logo Size
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="40"
                          step="5"
                          value={logoSize * 100}
                          onChange={(e) =>
                            setLogoSize(Number(e.target.value) / 100)
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          disabled={isLoading || isGenerating}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Small (10%)</span>
                          <span>Medium (25%)</span>
                          <span>Large (40%)</span>
                        </div>
                      </div>
                    )}

                    {/* Extended Color Palette */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Extended Color Palette
                      </label>

                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">
                            Foreground Colors
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {foregroundColors
                              .slice(0, 12)
                              .map((color, index) => (
                                <button
                                  key={`${color.hex}-${index}`}
                                  type="button"
                                  className={`w-6 h-6 rounded border ${
                                    selectedForegroundColor?.hex === color.hex
                                      ? "border-blue-500"
                                      : "border-gray-200"
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() =>
                                    setSelectedForegroundColor(color)
                                  }
                                  disabled={isLoading || isGenerating}
                                  title={color.name}
                                />
                              ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-600 mb-1">
                            Background Colors
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {backgroundColors
                              .slice(0, 12)
                              .map((color, index) => (
                                <button
                                  key={`${color.hex}-${index}`}
                                  type="button"
                                  className={`w-6 h-6 rounded border ${
                                    selectedBackgroundColor?.hex === color.hex
                                      ? "border-blue-500"
                                      : "border-gray-200"
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                  onClick={() =>
                                    setSelectedBackgroundColor(color)
                                  }
                                  disabled={isLoading || isGenerating}
                                  title={color.name}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Original URL Info - Moved to bottom and made less prominent */}
            <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
              <div className="text-xs font-medium text-gray-500 mb-1">
                Original URL
              </div>
              <div className="text-sm text-gray-700 break-all">
                {(() => {
                  if (isExistingUrl && selectedUrl) {
                    const original = selectedUrl.original_url || "";
                    return original.length > 50
                      ? `${original.substring(0, 50)}...`
                      : original;
                  } else if (!isExistingUrl && originalUrl) {
                    return originalUrl.length > 50
                      ? `${originalUrl.substring(0, 50)}...`
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
              QR Code Generated Successfully! 🎉
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your QR code has been generated and is ready to use. You can
              download it or share it using the buttons below.
            </p>

            {/* Selected URL Display in Success State */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <RiCheckboxCircleFill className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-green-900 mb-1">
                    QR Code Created For
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {isExistingUrl && selectedUrl
                      ? selectedUrl.title || `URL ${selectedUrl.id}`
                      : "New URL"}
                  </div>
                  <div className="text-xs text-green-700 font-mono bg-green-100 inline-block px-2 py-1 rounded mt-2">
                    {previewUrl}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
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
  );
};

export default QrCodeCustomizationStep;
