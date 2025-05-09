"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";

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
  /**
   * Logo size as a percentage (0.1 to 0.5)
   */
  logoSize?: number;
}

/**
 * QrCodePreview Component
 * @description A component for previewing QR codes with custom styling
 */
const QrCodePreview = React.memo(forwardRef<HTMLDivElement, QrCodePreviewProps>(
  (
    {
      foregroundColor,
      backgroundColor,
      includeLogoChecked,
      size = 300,
      generatedQrUrl = null,
      isLoading = false,
      value = "https://example.com",
      errorCorrectionLevel = "H",
      logoSize = 0.25,
    },
    ref
  ) => {
    // Internal ref to capture the container element for download
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose the container ref to parent components
    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    // Cache nilai properti untuk mencegah perubahan tak diinginkan
    const fgColor = React.useMemo(() => foregroundColor, [foregroundColor]);
    const bgColor = React.useMemo(() => backgroundColor, [backgroundColor]);
    const includeLogo = React.useMemo(() => includeLogoChecked, [includeLogoChecked]);

    // If we have a generated QR URL, display it instead of the preview
    if (generatedQrUrl) {
      return (
        <div
          className="relative flex items-center justify-center rounded-lg overflow-hidden"
          style={{ backgroundColor: bgColor, width: size, height: size }}
          ref={containerRef}
        >
          <Image
            src={generatedQrUrl}
            alt="Generated QR Code"
            width={size}
            height={size}
            className="object-contain"
            unoptimized
            priority
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
    const logoSizePixels = Math.round(size * logoSize);
    const logoContainerSize = Math.round(logoSizePixels * 1.4); // 40% padding around logo

    // Show QR code with react-qr-code
    return (
      <div
        className="relative flex items-center justify-center rounded-lg overflow-hidden"
        style={{ width: size, height: size, backgroundColor: bgColor }}
        data-testid="qr-code-preview"
        ref={containerRef}
      >
        {/* The QR Code */}
        <QRCode
          value={value}
          size={size - 20} // Slight padding
          fgColor={fgColor}
          bgColor={bgColor}
          level={errorCorrectionLevel}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />

        {/* Logo overlay */}
        {includeLogo && (
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: logoContainerSize,
              height: logoContainerSize,
              backgroundColor: bgColor,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Image
              src="/logo/logo-ksm.svg"
              alt="KSM Logo"
              width={logoSizePixels}
              height={logoSizePixels}
              style={{
                filter:
                  fgColor !== "#000000"
                    ? `brightness(0) saturate(100%) ${getColorFilterForSvg(
                        fgColor
                      )}`
                    : undefined,
              }}
            />
          </div>
        )}
      </div>
    );
  }
));

// Add display name for better debugging
QrCodePreview.displayName = "QrCodePreview";

/**
 * Calculate hue rotation for a hex color
 * @param hexColor - Hex color to calculate hue rotation for
 * @returns Hue rotation in degrees
 */
function getHueRotation(hexColor: string): number {
  // Simple approximate hue rotation calculation
  try {
    // Convert hex to RGB
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Calculate hue
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max === min) {
      h = 0; // No hue (grayscale)
    } else if (max === r) {
      h = 60 * (0 + (g - b) / (max - min));
    } else if (max === g) {
      h = 60 * (2 + (b - r) / (max - min));
    } else {
      h = 60 * (4 + (r - g) / (max - min));
    }

    if (h < 0) h += 360;
    return h;
  } catch {
    // In case of invalid hex, return 0
    return 0;
  }
}

/**
 * Convert hex color to CSS filter for SVG
 * @param hexColor - Hex color to convert
 * @returns CSS filter string
 */
function getColorFilterForSvg(hexColor: string): string {
  // For black, no filter needed
  if (hexColor === "#000000") return "";

  // For common colors, use predefined filters
  switch (hexColor.toLowerCase()) {
    case "#ff0000":
      return "invert(16%) sepia(98%) saturate(6451%) hue-rotate(358deg) brightness(97%) contrast(113%)"; // Red
    case "#0000ff":
      return "invert(8%) sepia(98%) saturate(6418%) hue-rotate(248deg) brightness(89%) contrast(143%)"; // Blue
    case "#00ff00":
      return "invert(72%) sepia(67%) saturate(5985%) hue-rotate(71deg) brightness(128%) contrast(122%)"; // Green
    case "#9400d3":
      return "invert(14%) sepia(87%) saturate(5242%) hue-rotate(281deg) brightness(83%) contrast(130%)"; // Purple
    case "#1e90ff":
      return "invert(49%) sepia(98%) saturate(1501%) hue-rotate(188deg) brightness(96%) contrast(104%)"; // Dodger Blue
    default:
      return `invert(38%) sepia(74%) saturate(1000%) hue-rotate(${getHueRotation(
        hexColor
      )}deg) brightness(92%) contrast(95%)`;
  }
}

export default QrCodePreview;