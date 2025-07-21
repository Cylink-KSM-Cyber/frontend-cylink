/**
 * URL Click Tracking Properties Interface
 *
 * Defines the properties required for tracking URL click events. Ensures structured and type-safe event tracking for URL clicks in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/UrlClickProperties
 */

import { DeviceType } from "@/types/conversionTracking";

export interface UrlClickProperties {
  url_id?: number;
  short_code: string;
  referrer?: string;
  user_agent?: string;
  location?: string;
  device_type?: DeviceType;
}
