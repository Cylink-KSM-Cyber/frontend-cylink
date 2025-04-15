"use client";

import React, { useEffect } from "react";
import { Url } from "@/interfaces/url";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import ColorSelector from "@/components/atoms/ColorSelector";
import QrCodePreview from "@/components/atoms/QrCodePreview";
import { useQrCode } from "@/hooks/useQrCode";
import { RiQrCodeLine, RiDownload2Line, RiShareLine } from "react-icons/ri";

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
 * QrCodeModal Component
 * @description Modal for QR code generation with customization options
 */
const QrCodeModal: React.FC<QrCodeModalProps> = ({ url, isOpen, onClose }) => {
  const {
    foregroundColors,
    backgroundColors,
    selectedForegroundColor,
    selectedBackgroundColor,
    includeLogoChecked,
    qrSize,
    isLoading,
    isGenerating,
    error,
    generatedQrUrl,
    setSelectedForegroundColor,
    setSelectedBackgroundColor,
    setIncludeLogoChecked,
    loadColors,
    generateQrCodeForUrl,
    resetQrCode,
  } = useQrCode();

  // Load colors when modal opens
  useEffect(() => {
    if (isOpen) {
      loadColors();
      resetQrCode();
    }
  }, [isOpen, loadColors, resetQrCode]);

  // Handle Generate QR Code button click
  const handleGenerateClick = async () => {
    if (!url) return;
    await generateQrCodeForUrl(url);
  };

  // Handle Download QR Code button click
  const handleDownloadClick = () => {
    if (!generatedQrUrl) return;

    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = generatedQrUrl;
    a.download = `qrcode-${url?.short_code || "link"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle Share QR Code button click
  const handleShareClick = async () => {
    if (!generatedQrUrl || !url) return;

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${url.short_url}`,
          text: `Scan this QR code to visit ${url.short_url}`,
          url: url.short_url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url.short_url);
      alert("URL copied to clipboard!");
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
      size="md"
      footer={renderFooterButtons()}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* QR Code Preview */}
        <div className="flex items-center justify-center md:w-1/2">
          <QrCodePreview
            foregroundColor={selectedForegroundColor?.hex || "#000000"}
            backgroundColor={selectedBackgroundColor?.hex || "#FFFFFF"}
            includeLogoChecked={includeLogoChecked}
            generatedQrUrl={generatedQrUrl}
            isLoading={isLoading || isGenerating}
          />
        </div>

        {/* Customization Options */}
        <div className="md:w-1/2">
          {!generatedQrUrl ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Customize Your QR Code
              </h3>

              {/* Foreground Color Selection */}
              <ColorSelector
                label="Foreground Color"
                colors={foregroundColors}
                selectedColor={selectedForegroundColor}
                onSelect={setSelectedForegroundColor}
                disabled={isLoading || isGenerating}
              />

              {/* Background Color Selection */}
              <ColorSelector
                label="Background Color"
                colors={backgroundColors}
                selectedColor={selectedBackgroundColor}
                onSelect={setSelectedBackgroundColor}
                disabled={isLoading || isGenerating}
              />

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
