/**
 * URL Edit Tracking Properties Interface
 *
 * Defines the properties required for tracking URL edit events. Ensures structured and type-safe event tracking for URL edits in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/UrlEditProperties
 */

import { UrlEditMethod } from "@/types/conversionTracking";

export interface UrlEditProperties {
  url_id: number;
  url_title: string;
  has_custom_code: boolean;
  custom_code_length: number;
  expiry_date: string;
  original_url_length: number;
  edit_method: UrlEditMethod;
  fields_modified: string[];
  success: boolean;
}
