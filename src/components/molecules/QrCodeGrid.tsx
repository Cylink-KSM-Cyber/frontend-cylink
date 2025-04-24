import React from "react";
import { QrCode } from "@/interfaces/url";
import ButtonIcon from "@/components/atoms/ButtonIcon";
import Image from "next/image";
import QrCodePreview from "@/components/atoms/QrCodePreview";

// Icon imports
import {
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

  // Render QR code using QrCodePreview component which already handles styling consistently
  const renderQrCode = (qrCode: QrCode) => {
    console.log("Rendering QR code with data:", qrCode.id, {
      shortUrl: qrCode.shortUrl,
      customization: qrCode.customization,
    });

    // Extract customization properties with fallbacks
    const fgColor = qrCode.customization?.foregroundColor || "#000000";
    const bgColor = qrCode.customization?.backgroundColor || "#FFFFFF";
    const includeLogo = qrCode.customization?.includeLogo || false;
    const value = qrCode.shortUrl || `https://example.com/${qrCode.id}`;
    const logoSize = qrCode.customization?.logoSize || 0.25;

    return (
      <QrCodePreview
        foregroundColor={fgColor}
        backgroundColor={bgColor}
        includeLogoChecked={includeLogo}
        size={150}
        value={value}
        errorCorrectionLevel="H"
        logoSize={logoSize}
        generatedQrUrl={null} // Don't use external URL
      />
    );
  };

  // Simple fallback component in case QR code rendering fails
  const QRCodeWithFallback: React.FC<{
    qrCode: QrCode;
    renderFunction: (qrCode: QrCode) => React.ReactNode;
  }> = ({ qrCode, renderFunction }) => {
    const [hasError, setHasError] = React.useState(false);

    React.useEffect(() => {
      // Reset error state if QR code changes
      setHasError(false);
    }, [qrCode.id]);

    if (hasError) {
      return (
        <div className="text-center">
          <div className="text-red-500 mb-2">Could not load QR code</div>
          <div className="text-sm text-gray-500">
            <Image
              src="/logo/logo-ksm.svg"
              alt="Logo"
              width={30}
              height={30}
              className="mx-auto mb-2"
            />
            Try regenerating the QR code
          </div>
        </div>
      );
    }

    try {
      return <>{renderFunction(qrCode)}</>;
    } catch (error) {
      console.error("Error rendering QR code:", error);
      setHasError(true);
      return (
        <div className="text-center">
          <div className="text-red-500 mb-2">Could not load QR code</div>
          <div className="text-sm text-gray-500">
            Try regenerating the QR code
          </div>
        </div>
      );
    }
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
                qrCode.customization?.backgroundColor || "#FFFFFF",
              padding: "1rem",
            }}
            onClick={() => onPreview?.(qrCode)}
          >
            <QRCodeWithFallback qrCode={qrCode} renderFunction={renderQrCode} />

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
            <div className="flex justify-center gap-6">
              <ButtonIcon
                icon={<RiExternalLinkLine />}
                onClick={() => {
                  // We don't have direct URLs anymore since we're generating QR codes on the fly
                  // So let's copy the short URL to clipboard instead
                  if (qrCode.shortUrl) {
                    navigator.clipboard.writeText(qrCode.shortUrl);
                    // Ideally we'd show a toast, but we don't have access to showToast here
                    console.log(`Copied to clipboard: ${qrCode.shortUrl}`);
                    // Create a temporary notification
                    const notification = document.createElement("div");
                    notification.textContent = "URL copied to clipboard!";
                    notification.style.position = "fixed";
                    notification.style.bottom = "20px";
                    notification.style.right = "20px";
                    notification.style.backgroundColor = "#333";
                    notification.style.color = "#fff";
                    notification.style.padding = "10px 20px";
                    notification.style.borderRadius = "4px";
                    notification.style.zIndex = "9999";
                    document.body.appendChild(notification);

                    // Remove notification after 2 seconds
                    setTimeout(() => {
                      document.body.removeChild(notification);
                    }, 2000);
                  }
                }}
                tooltip="Copy URL"
                ariaLabel="Copy URL to clipboard"
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
