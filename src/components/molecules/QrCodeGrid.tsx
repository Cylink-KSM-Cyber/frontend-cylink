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
  RiCheckboxBlankLine,
  RiCheckboxLine,
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
   * Array of selected QR codes
   */
  selectedQrCodes?: QrCode[];
  /**
   * Function to call when QR code selection changes
   */
  onSelectQrCode?: (qrCode: QrCode, selected: boolean) => void;
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
  selectedQrCodes = [],
  onSelectQrCode,
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

  // Check if a QR code is selected
  const isSelected = (qrCode: QrCode) => {
    return selectedQrCodes.some((selected) => selected.id === qrCode.id);
  };

  // Handle checkbox change
  const handleCheckboxChange = (qrCode: QrCode, checked: boolean) => {
    if (onSelectQrCode) {
      onSelectQrCode(qrCode, checked);
    }
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
    return null;
  }

  // Render QR code using QrCodePreview component which already handles styling consistently
  const renderQrCode = (qrCode: QrCode) => {
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
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {qrCodes.map((qrCode) => (
        <div
          key={qrCode.id}
          className={`relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-150 ${
            isSelected(qrCode) ? "ring-2 ring-primary-500" : "hover:shadow-md"
          }`}
        >
          {/* Selection checkbox overlay */}
          {onSelectQrCode && (
            <div className="absolute top-2 left-2 z-10">
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected(qrCode)}
                  onChange={(e) =>
                    handleCheckboxChange(qrCode, e.target.checked)
                  }
                />
                <div className="h-6 w-6 rounded-full bg-white shadow-sm flex items-center justify-center">
                  {isSelected(qrCode) ? (
                    <RiCheckboxLine className="text-primary-600 text-lg" />
                  ) : (
                    <RiCheckboxBlankLine className="text-gray-400 text-lg" />
                  )}
                </div>
              </label>
            </div>
          )}

          {/* QR Code */}
          <div
            className="p-6 flex justify-center items-center cursor-pointer"
            onClick={() => onPreview && onPreview(qrCode)}
          >
            <QRCodeWithFallback qrCode={qrCode} renderFunction={renderQrCode} />
          </div>

          {/* Info */}
          <div className="p-4 bg-gray-50">
            <h3
              className="font-medium text-gray-900 mb-1 truncate"
              title={qrCode.title || qrCode.shortUrl || "Untitled"}
            >
              {qrCode.title || qrCode.shortUrl || "Untitled"}
            </h3>
            <p
              className="text-sm text-gray-500 mb-3 truncate"
              title={qrCode.description || qrCode.shortUrl}
            >
              {qrCode.description || qrCode.shortUrl}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {formatDate(qrCode.createdAt)}
              </span>

              {qrCode.scans !== undefined && (
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  {qrCode.scans} {qrCode.scans === 1 ? "scan" : "scans"}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3 flex justify-between">
              {onEdit && (
                <ButtonIcon
                  icon={<RiEditLine />}
                  onClick={() => onEdit(qrCode)}
                  tooltip="Edit"
                  className="text-gray-500 hover:text-gray-700"
                  ariaLabel="Edit QR code"
                />
              )}
              {onPreview && (
                <ButtonIcon
                  icon={<RiExternalLinkLine />}
                  onClick={() => onPreview(qrCode)}
                  tooltip="Preview"
                  className="text-gray-500 hover:text-gray-700"
                  ariaLabel="Preview QR code"
                />
              )}
              {onDelete && (
                <ButtonIcon
                  icon={<RiDeleteBinLine />}
                  onClick={() => onDelete(qrCode)}
                  tooltip="Delete"
                  className="text-red-500 hover:text-red-700"
                  ariaLabel="Delete QR code"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QrCodeGrid;
