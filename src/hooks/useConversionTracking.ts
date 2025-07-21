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
import { useTrackConversion } from "./conversionTrackings/useTrackConversion";
import { useTrackFeatureUsage } from "./conversionTrackings/useTrackFeatureUsage";
import { useTrackError } from "./conversionTrackings/useTrackError";

/**
 * Custom hook for PostHog conversion tracking
 * @description Provides centralized conversion tracking functionality with type safety
 * @returns Object with conversion tracking methods
 */
export const useConversionTracking = () => {
  return {
    ...useTrackUrlCreation(),
    ...useTrackUrlEdit(),
    ...useTrackUrlDeletion(),
    ...useTrackUrlClick(),
    ...useTrackQrCodeGeneration(),
    ...useTrackQrCodeEdit(),
    ...useTrackQrCodeDeletion(),
    ...useTrackQrCodeDownload(),
    ...useTrackQrCodeSharing(),
    ...useTrackQrCodePreviewInteraction(),
    ...useTrackConversion(),
    ...useTrackFeatureUsage(),
    ...useTrackError(),
  };
};

export default useConversionTracking;
