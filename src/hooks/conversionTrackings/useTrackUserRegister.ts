/**
 * User Register Conversion Tracking
 *
 * Provides a hook for tracking user registration conversion events in PostHog analytics.
 * Encapsulates logic for capturing user registration with relevant metadata.
 *
 * @module src/hooks/conversionTrackings/useTrackUserRegister
 */
import { useCallback } from "react";
import posthogClient, { PostHogEventProperties } from "@/utils/posthogClient";
import { UserRegisterProperties } from "@/interfaces/conversionTrackings/UserRegisterProperties";
import { getBaseEventProperties } from "@/utils/conversionTrackingEventUtils";

export const useTrackUserRegister = () => {
  const trackUserRegister = useCallback(
    (properties: UserRegisterProperties) => {
      if (!properties.user_id || properties.user_id <= 0) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Invalid user_id provided to trackUserRegister");
        }
        return;
      }
      if (!properties.email || properties.email.trim().length === 0) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Invalid email provided to trackUserRegister");
        }
        return;
      }
      if (!properties.username || properties.username.trim().length === 0) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Invalid username provided to trackUserRegister");
        }
        return;
      }
      const eventProperties: PostHogEventProperties = {
        ...getBaseEventProperties(),
        ...properties,
      };
      posthogClient.captureEvent("user_registered", eventProperties);
    },
    []
  );
  return { trackUserRegister };
};
