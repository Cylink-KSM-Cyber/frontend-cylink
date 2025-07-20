/**
 * Conversion Tracking Hook Return Interface
 *
 * Defines the return type for the useConversionTracking hook, encapsulating all tracking methods for conversion events and analytics.
 *
 * @module src/interfaces/conversionTrackings/UseConversionTrackingReturn
 */

import { PostHogEventProperties } from "@/utils/posthogClient";
import { UrlCreationProperties } from "./UrlCreationProperties";
import { UrlEditProperties } from "./UrlEditProperties";
import { UrlDeletionProperties } from "./UrlDeletionProperties";
import { UrlClickProperties } from "./UrlClickProperties";
import { QrCodeGenerationProperties } from "./QrCodeGenerationProperties";
import { ConversionGoalType } from "@/types/conversionTracking";

export interface UseConversionTrackingReturn {
  /** Track URL creation conversion */
  trackUrlCreation: (properties: UrlCreationProperties) => void;
  /** Track URL edit conversion */
  trackUrlEdit: (properties: UrlEditProperties) => void;
  /** Track URL deletion conversion */
  trackUrlDeletion: (properties: UrlDeletionProperties) => void;
  /** Track URL click conversion */
  trackUrlClick: (properties: UrlClickProperties) => void;
  /** Track QR code generation conversion */
  trackQrCodeGeneration: (properties: QrCodeGenerationProperties) => void;
  /** Track generic conversion goal */
  trackConversion: (
    goalType: ConversionGoalType,
    properties?: PostHogEventProperties
  ) => void;
  /** Track feature usage */
  trackFeatureUsage: (
    featureName: string,
    properties?: PostHogEventProperties
  ) => void;
  /** Track error occurrence */
  trackError: (
    errorType: string,
    errorMessage: string,
    properties?: PostHogEventProperties
  ) => void;
}
