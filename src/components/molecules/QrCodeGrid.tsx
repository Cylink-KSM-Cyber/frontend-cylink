import React from "react";
import { QrCode } from "@/interfaces/url";
import ButtonIcon from "@/components/atoms/ButtonIcon";
import Image from "next/image";
import QRCode from "react-qr-code";

// Icon imports
import {
  RiDownloadLine,
  RiExternalLinkLine,
  RiEditLine,
  RiDeleteBinLine,
} from "react-icons/ri";

/**
 * Prop types for QrCodeGrid component
 */
interface QrCodeGridProps {
  /**
   * Array of QR code data to display
   */
  qrCodes: QrCode[];
  /**
   * Whether the data is loading
   */
  isLoading?: boolean;
  /**
   * Function to call when download button is clicked
   */
  onDownload?: (qrCode: QrCode) => void;
  /**
   * Function to call when edit button is clicked
   */
  onEdit?: (qrCode: QrCode) => void;
  /**
   * Function to call when delete button is clicked
   */
  onDelete?: (qrCode: QrCode) => void;
  /**
   * Function to call when QR code is clicked for preview
   */
  onPreview?: (qrCode: QrCode) => void;
  /**
   * Optional CSS classes to apply
   */
  className?: string;
}

/**
 * QrCodeGrid Component
 * @description Displays QR codes in a responsive grid layout with real images and customizations
 */
const QrCodeGrid: React.FC<QrCodeGridProps> = ({
  qrCodes,
  isLoading = false,
  onDownload,
  onEdit,
  onDelete,
  onPreview,
  className = "",
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // If loading, show skeleton grid
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // If no QR codes, show empty state
  if (qrCodes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="py-6">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3H8V8H3V3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 3H21V8H16V3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 16H8V21H3V16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 16H21V21H16V16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No QR Codes Found
          </h3>
          <p className="text-gray-500 mb-4">
            You haven&apos;t generated any QR codes yet.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to determine if a URL is valid for rendering
  const isValidUrl = (url: string | undefined): boolean => {
    if (!url) return false;
    try {
      return Boolean(new URL(url));
    } catch {
      return false;
    }
  };

  // Render QR code using either image URL or react-qr-code component
  const renderQrCode = (qrCode: QrCode) => {
    // If we have a valid API-generated QR code image, use it
    if (isValidUrl(qrCode.imageUrl)) {
      return (
        <Image
          src={qrCode.imageUrl}
          alt={qrCode.title || `QR Code ${qrCode.id}`}
          width={150}
          height={150}
          className="h-auto w-auto max-h-full max-w-full object-contain"
          unoptimized
        />
      );
    }

    // If we don't have a valid image URL, render with react-qr-code
    // using customization colors if available
    const fgColor = qrCode.customization?.foregroundColor || "#000000";
    const bgColor = qrCode.customization?.backgroundColor || "#FFFFFF";
    const value = qrCode.shortUrl || `https://example.com/${qrCode.id}`;

    return (
      <div className="relative">
        <QRCode
          value={value}
          size={150}
          fgColor={fgColor}
          bgColor={bgColor}
          level="H"
        />

        {/* Add logo if includeLogo is true */}
        {qrCode.customization?.includeLogo && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full flex items-center justify-center"
            style={{
              width: `${
                qrCode.customization?.logoSize
                  ? qrCode.customization.logoSize * 40
                  : 30
              }px`,
              height: `${
                qrCode.customization?.logoSize
                  ? qrCode.customization.logoSize * 40
                  : 30
              }px`,
            }}
          >
            <Image
              src="/logo/logo-ksm.svg"
              alt="Logo"
              width={
                qrCode.customization?.logoSize
                  ? qrCode.customization.logoSize * 30
                  : 20
              }
              height={
                qrCode.customization?.logoSize
                  ? qrCode.customization.logoSize * 30
                  : 20
              }
              className="object-contain"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {qrCodes.map((qrCode) => (
        <div
          key={qrCode.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* QR Code Image */}
          <div
            className="relative h-48 flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor:
                qrCode.customization?.backgroundColor || "#F5F5F5",
            }}
            onClick={() => onPreview?.(qrCode)}
          >
            {renderQrCode(qrCode)}

            {/* Overlay with information on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">
                Click to preview
              </span>
            </div>

            {/* Custom indicator */}
            {qrCode.customization && (
              <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                Custom
              </div>
            )}
          </div>

          {/* QR Code Info */}
          <div className="p-4">
            <h3 className="text-base font-medium text-[#333333] mb-1">
              {qrCode.title || `QR Code ${String(qrCode.id).substring(0, 6)}`}
            </h3>
            <p className="text-xs text-[#607D8B] mb-2">
              Created: {formatDate(qrCode.createdAt)}
            </p>
            <p className="text-xs text-[#333333] mb-3">
              Scanned:{" "}
              <span className="font-medium">
                {qrCode.scans.toLocaleString()} times
              </span>
            </p>

            {/* Action buttons */}
            <div className="flex justify-between">
              <ButtonIcon
                icon={<RiDownloadLine />}
                onClick={() => onDownload?.(qrCode)}
                tooltip="Download"
                ariaLabel="Download QR code"
                variant="primary"
              />
              <ButtonIcon
                icon={<RiExternalLinkLine />}
                onClick={() =>
                  window.open(qrCode.imageUrl || qrCode.pngUrl, "_blank")
                }
                tooltip="View full size"
                ariaLabel="View full size QR code"
              />
              <ButtonIcon
                icon={<RiEditLine />}
                onClick={() => onEdit?.(qrCode)}
                tooltip="Edit"
                ariaLabel="Edit QR code"
              />
              <ButtonIcon
                icon={<RiDeleteBinLine />}
                onClick={() => onDelete?.(qrCode)}
                tooltip="Delete"
                ariaLabel="Delete QR code"
                variant="danger"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QrCodeGrid;
