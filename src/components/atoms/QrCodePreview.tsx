"use client";

import React from "react";
import Image from "next/image";
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

  // Show preview with placeholder QR pattern and colored logo
  return (
    <div
      className="relative flex items-center justify-center rounded-lg overflow-hidden"
      style={{ backgroundColor, width: size, height: size }}
    >
      {/* Placeholder QR code pattern */}
      <div className="grid grid-cols-7 gap-2 p-6 w-full h-full">
        {/* Top-left position detection pattern */}
        <div
          className="col-span-2 row-span-2 rounded-lg"
          style={{ backgroundColor: foregroundColor }}
        ></div>

        {/* Top-right position detection pattern */}
        <div
          className="col-start-6 col-span-2 row-span-2 rounded-lg"
          style={{ backgroundColor: foregroundColor }}
        ></div>

        {/* Bottom-left position detection pattern */}
        <div
          className="col-span-2 row-start-6 row-span-2 rounded-lg"
          style={{ backgroundColor: foregroundColor }}
        ></div>

        {/* Random QR code-like pattern */}
        <div
          className="col-start-3 row-start-1 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-4 row-start-2 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-2 row-start-3 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-5 row-start-3 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-1 row-start-4 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-3 row-start-4 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-6 row-start-4 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-2 row-start-5 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-4 row-start-5 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-7 row-start-5 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-3 row-start-6 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
        <div
          className="col-start-5 row-start-7 rounded"
          style={{ backgroundColor: foregroundColor }}
        ></div>
      </div>

      {/* Logo overlay */}
      {includeLogoChecked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 rounded-full" style={{ backgroundColor }}>
            <KsmLogo
              color={foregroundColor}
              width={60}
              height={60}
              className="transform scale-90"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodePreview;
