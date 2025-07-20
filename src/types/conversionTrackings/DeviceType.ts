/**
 * Device Type
 *
 * Defines the types of devices that can be tracked for analytics. Helps categorize user interactions by device type.
 *
 * @module src/types/conversionTrackings/DeviceType
 */

export type DeviceType = "mobile" | "desktop" | "tablet" | "other";

/**
 * Type guard to check if a value is a valid DeviceType
 * @param value - Value to check
 * @returns True if value is a valid DeviceType
 */
export const isDeviceType = (value: unknown): value is DeviceType => {
  const validTypes: DeviceType[] = ["mobile", "desktop", "tablet", "other"];
  return typeof value === "string" && validTypes.includes(value as DeviceType);
};
