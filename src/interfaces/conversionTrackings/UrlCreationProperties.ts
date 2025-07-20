/**
 * URL Creation Tracking Properties Interface
 *
 * Defines the properties required for tracking URL creation events. Ensures structured and type-safe event tracking for URL creation in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/UrlCreationProperties
 */

import { UrlCreationMethod } from "@/types/conversionTracking";

export interface UrlCreationProperties {
  url_id: number;
  url_title: string;
  has_custom_code: boolean;
  custom_code_length: number;
  expiry_date: string;
  original_url_length: number;
  creation_method: UrlCreationMethod;
  success: boolean;
}
