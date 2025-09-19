/**
 * Conversion Tracking Entry Point
 *
 * This module serves as the centralized entry point for all conversion tracking hooks and utilities.
 * It delegates specific tracking responsibilities to modular hooks located in src/hooks/conversionTrackings/.
 * This design promotes flexibility, maintainability, and adherence to SOLID principles, ensuring that
 * each conversion tracking concern is handled in its own module while providing a unified interface
 * for the rest of the application.
 *
 * @module src/hooks/useConversionTracking
 */

// Import modular tracking hooks
import { useTrackUrlCreation } from "./conversionTrackings/useTrackUrlCreation";
import { useTrackUrlEdit } from "./conversionTrackings/useTrackUrlEdit";
import { useTrackUrlDeletion } from "./conversionTrackings/useTrackUrlDeletion";
import { useTrackUrlClick } from "./conversionTrackings/useTrackUrlClick";
import { useTrackQrCodeGeneration } from "./conversionTrackings/useTrackQrCodeGeneration";
import { useTrackQrCodeEdit } from "./conversionTrackings/useTrackQrCodeEdit";
import { useTrackQrCodeDeletion } from "./conversionTrackings/useTrackQrCodeDeletion";
import { useTrackQrCodeDownload } from "./conversionTrackings/useTrackQrCodeDownload";
import { useTrackQrCodeSharing } from "./conversionTrackings/useTrackQrCodeSharing";
import { useTrackQrCodePreviewInteraction } from "./conversionTrackings/useTrackQrCodePreviewInteraction";
import { useTrackQrCodePreviewEvent } from "./conversionTrackings/useTrackQrCodePreviewEvent";
import { useTrackQrCodeBulkOperation } from "./conversionTrackings/useTrackQrCodeBulkOperation";
import { useTrackConversion } from "./conversionTrackings/useTrackConversion";
import { useTrackFeatureUsage } from "./conversionTrackings/useTrackFeatureUsage";
import { useTrackError } from "./conversionTrackings/useTrackError";
import { useTrackUserRegister } from "./conversionTrackings/useTrackUserRegister";

/**
 * Custom hook for PostHog conversion tracking
 * @description Provides centralized conversion tracking functionality with type safety
 * @returns Object with conversion tracking methods
 */
export const useConversionTracking = () => {
  // Instantiate individual trackers once to enable cross-calls
  const urlCreation = useTrackUrlCreation();
  const urlEdit = useTrackUrlEdit();
  const urlDeletion = useTrackUrlDeletion();
  const urlClick = useTrackUrlClick();
  const qrGeneration = useTrackQrCodeGeneration();
  const qrEdit = useTrackQrCodeEdit();
  const qrDeletion = useTrackQrCodeDeletion();
  const qrDownload = useTrackQrCodeDownload();
  const qrSharing = useTrackQrCodeSharing();
  const qrPreview = useTrackQrCodePreviewInteraction();
  const { trackQrCodePreviewEvent } = useTrackQrCodePreviewEvent();
  const qrBulk = useTrackQrCodeBulkOperation();
  const conversion = useTrackConversion();
  const featureUsage = useTrackFeatureUsage();
  const error = useTrackError();
  const userRegister = useTrackUserRegister();

  // trackQrCodePreviewEvent is now provided by useTrackQrCodePreviewEvent

  return {
    ...urlCreation,
    ...urlEdit,
    ...urlDeletion,
    ...urlClick,
    ...qrGeneration,
    ...qrEdit,
    ...qrDeletion,
    ...qrDownload,
    ...qrSharing,
    ...qrPreview,
    trackQrCodePreviewEvent,
    ...qrBulk,
    ...conversion,
    ...featureUsage,
    ...error,
    ...userRegister,
  };
};

export default useConversionTracking;
