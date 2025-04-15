"use client";

import React from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import KsmLogo from "./KsmLogo";

/**
 * Props for QrCodePreview component
 */
interface QrCodePreviewProps {
  /**
   * Foreground color hex code
   */
  foregroundColor: string;
  /**
   * Background color hex code
   */
  backgroundColor: string;
  /**
   * Whether to include the logo
   */
  includeLogoChecked: boolean;
  /**
   * Size of the QR code preview in pixels
   */
  size?: number;
  /**
   * URL of the generated QR code (if available)
   */
  generatedQrUrl?: string | null;
  /**
   * Whether the component is in loading state
   */
  isLoading?: boolean;
  /**
   * Value to encode in the QR code (for preview)
   */
  value?: string;
  /**
   * Error correction level (L: 7%, M: 15%, Q: 25%, H: 30%)
   */
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

/**
 * QrCodePreview Component
 * @description A component for previewing QR codes with custom styling
 */
const QrCodePreview: React.FC<QrCodePreviewProps> = ({
  foregroundColor,
  backgroundColor,
  includeLogoChecked,
  size = 300,
  generatedQrUrl = null,
  isLoading = false,
  value = "https://example.com",
  errorCorrectionLevel = "H",
}) => {
  // If we have a generated QR URL, display it instead of the preview
  if (generatedQrUrl) {
    return (
      <div
        className="relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{ backgroundColor, width: size, height: size }}
      >
        <Image
          src={generatedQrUrl}
          alt="Generated QR Code"
          width={size}
          height={size}
          className="object-contain"
        />
      </div>
    );
  }

  // Show loading skeleton
  if (isLoading) {
    return (
      <div
        className="animate-pulse flex items-center justify-center rounded-lg"
        style={{ backgroundColor: "#f3f4f6", width: size, height: size }}
      >
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
      </div>
    );
  }

  // Calculate logo size relative to QR code size
  const logoSize = Math.round(size * 0.25);
  const logoPadding = Math.round(size * 0.05);

  // Show QR code with react-qr-code
  return (
    <div
      className="relative flex items-center justify-center rounded-lg overflow-hidden"
      style={{ width: size, height: size, backgroundColor }}
    >
      {/* The QR Code */}
      <QRCode
        value={value}
        size={size - 20} // Slight padding
        fgColor={foregroundColor}
        bgColor={backgroundColor}
        level={errorCorrectionLevel}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />

      {/* Logo overlay */}
      {includeLogoChecked && (
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: logoSize + logoPadding * 2,
            height: logoSize + logoPadding * 2,
            backgroundColor,
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <KsmLogo color={foregroundColor} width={logoSize} height={logoSize} />
        </div>
      )}
    </div>
  );
};

export default QrCodePreview;
