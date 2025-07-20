/**
 * URL Deletion Tracking Properties Interface
 *
 * Defines the properties required for tracking URL deletion events. Ensures structured and type-safe event tracking for URL deletions in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/UrlDeletionProperties
 */

import { UrlDeletionMethod } from "@/types/conversionTracking";

export interface UrlDeletionProperties {
  url_id: number;
  url_title: string;
  short_code: string;
  original_url_length: number;
  total_clicks: number;
  deletion_method: UrlDeletionMethod;
  deletion_reason?: string;
  success: boolean;
}
