/**
 * Conversion Tracking Interfaces Entry Point
 *
 * This module serves as the entry point for all conversion tracking-related interfaces. It re-exports modularized interfaces from the conversionTrackings directory, providing a single import source for conversion tracking type safety across the application.
 *
 * @module src/interfaces/conversionTracking
 */

export * from "./conversionTrackings/UrlCreationProperties";
export * from "./conversionTrackings/UrlEditProperties";
export * from "./conversionTrackings/UrlDeletionProperties";
export * from "./conversionTrackings/UrlClickProperties";
export * from "./conversionTrackings/QrCodeCustomizationOptions";
export * from "./conversionTrackings/QrCodeGenerationProperties";
export * from "./conversionTrackings/QrCodeEditProperties";
export * from "./conversionTrackings/QrCodeDeletionProperties";
export * from "./conversionTrackings/QrCodeDownloadProperties";
export * from "./conversionTrackings/QrCodeSharingProperties";
export * from "./conversionTrackings/UseConversionTrackingReturn";
