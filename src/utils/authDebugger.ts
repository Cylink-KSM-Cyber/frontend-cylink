/**
 * Authentication Debug Utility
 * @description Utility functions for debugging authentication issues in development
 */

import Cookies from "js-cookie";

/**
 * Check authentication status and log comprehensive debug information
 * @description Useful for debugging authentication issues
 */
export const debugAuthStatus = (): void => {
  if (process.env.NODE_ENV !== "development") {
    return; // Only run in development
  }

  console.group("[AUTH DEBUG] Authentication Status Check");

  try {
    // Check if we're in browser
    const isBrowser = typeof window !== "undefined";
    console.log("Environment:", {
      isBrowser,
      nodeEnv: process.env.NODE_ENV,
      userAgent: isBrowser
        ? navigator.userAgent.substring(0, 50) + "..."
        : "N/A",
    });

    if (!isBrowser) {
      console.warn("Running on server-side, skipping cookie checks");
      console.groupEnd();
      return;
    }

    // Check tokens
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const userData = Cookies.get("userData");

    console.log("Token Status:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUserData: !!userData,
      accessTokenLength: accessToken ? accessToken.length : 0,
      refreshTokenLength: refreshToken ? refreshToken.length : 0,
    });

    // Parse and validate token if available
    if (accessToken) {
      try {
        // Basic JWT structure validation (without verifying signature)
        const tokenParts = accessToken.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);

          console.log("Token Payload:", {
            userId: payload.id,
            userEmail: payload.email,
            userRole: payload.role,
            issuedAt: new Date(payload.iat * 1000).toISOString(),
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            isExpired: payload.exp < now,
            timeUntilExpiry:
              payload.exp - now > 0
                ? `${payload.exp - now} seconds`
                : "EXPIRED",
          });
        } else {
          console.error("Invalid JWT format");
        }
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }

    // Check user data
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("User Data:", {
          id: parsedUserData.id,
          email: parsedUserData.email,
          username: parsedUserData.username,
          role: parsedUserData.role,
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }

    // Check all cookies
    const allCookies = document.cookie;
    console.log("All Cookies:", allCookies);
  } catch (error) {
    console.error("Auth debug error:", error);
  }

  console.groupEnd();
};

/**
 * Monitor authentication changes
 * @description Sets up a listener to monitor authentication state changes
 */
export const monitorAuthChanges = (): (() => void) => {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return () => {}; // Return empty cleanup function
  }

  let lastTokenState = {
    accessToken: Cookies.get("accessToken"),
    refreshToken: Cookies.get("refreshToken"),
    userData: Cookies.get("userData"),
  };

  const checkForChanges = () => {
    const currentTokenState = {
      accessToken: Cookies.get("accessToken"),
      refreshToken: Cookies.get("refreshToken"),
      userData: Cookies.get("userData"),
    };

    const hasChanged =
      lastTokenState.accessToken !== currentTokenState.accessToken ||
      lastTokenState.refreshToken !== currentTokenState.refreshToken ||
      lastTokenState.userData !== currentTokenState.userData;

    if (hasChanged) {
      console.log("[AUTH MONITOR] Authentication state changed:", {
        previous: lastTokenState,
        current: currentTokenState,
      });
      lastTokenState = currentTokenState;
    }
  };

  const intervalId = setInterval(checkForChanges, 1000); // Check every second

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
  };
};
