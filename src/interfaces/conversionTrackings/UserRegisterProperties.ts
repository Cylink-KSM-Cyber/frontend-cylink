/**
 * User Register Tracking Properties Interface
 *
 * Defines the properties required for tracking user registration events. Ensures structured and type-safe event tracking for user registration in analytics systems.
 *
 * @module src/interfaces/conversionTrackings/UserRegisterProperties
 */

export interface UserRegisterProperties {
  user_id: number;
  email: string;
  username: string;
  is_verified: boolean;
  registration_success: boolean;
}
