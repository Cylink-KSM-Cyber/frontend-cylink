import { post } from "./api";
import {
  LoginRequest,
  ApiLoginResponse,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@/interfaces/auth";
import Cookies from "js-cookie";

/**
 * Authentication service for login, registration, and other auth operations
 * @description Provides methods for authentication-related API calls
 */
const AuthService = {
  /**
   * Login user with email and password
   * @param credentials - User credentials containing email and password
   * @returns Promise with login response data
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      // Call API with original request structure
      const apiResponse = await post<ApiLoginResponse>(
        "/api/v1/auth/login",
        credentials
      );
      console.log("Raw API response:", apiResponse);

      // Validate response structure (for the actual API response)
      if (!apiResponse?.data?.user || !apiResponse?.data?.token) {
        console.error("Invalid login response structure:", apiResponse);
        throw new Error("Invalid response from server");
      }

      if (!apiResponse.data.token.access || !apiResponse.data.token.refresh) {
        console.error("Missing tokens in response:", apiResponse.data.token);
        throw new Error("Authentication tokens missing in response");
      }

      // Convert the API response to our expected format
      const formattedResponse: LoginResponse = {
        status: apiResponse.status,
        message: apiResponse.message,
        data: {
          user: apiResponse.data.user,
          tokens: {
            access_token: apiResponse.data.token.access,
            refresh_token: apiResponse.data.token.refresh,
          },
        },
      };

      return formattedResponse;
    } catch (error) {
      console.error("Login service error:", error);
      throw error;
    }
  },

  /**
   * Save authentication tokens to local storage
   * @param accessToken - JWT access token
   * @param refreshToken - JWT refresh token
   * @param remember - Whether to store tokens persistently
   */
  saveTokens: (
    accessToken: string,
    refreshToken: string,
    remember: boolean = false
  ): void => {
    if (typeof window === "undefined") return;

    if (!accessToken || !refreshToken) {
      console.error("Attempting to save invalid tokens:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });
      throw new Error("Cannot save invalid authentication tokens");
    }

    try {
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      // Set session expiration based on remember me option
      if (remember) {
        // Store a flag to indicate "remember me" was selected
        Cookies.set("rememberMe", "true");
      } else {
        Cookies.remove("rememberMe");
      }
    } catch (error) {
      console.error("Error saving tokens to Cookies:", error);
      throw new Error("Failed to save authentication data");
    }
  },

  /**
   * Clear authentication tokens from storage on logout
   */
  clearTokens: (): void => {
    if (typeof window === "undefined") return;

    try {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("rememberMe");
    } catch (error) {
      console.error("Error clearing tokens from Cookies:", error);
    }
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user has a valid token
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;

    try {
      const token = Cookies.get("accessToken");
      return !!token;
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return false;
    }
  },

  /**
   * Get stored access token
   * @returns The stored access token or null if not found
   */
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;

    try {
      const token = Cookies.get("accessToken");
      return token ?? null;
    } catch (error) {
      console.error("Error retrieving token from Cookies:", error);
      return null;
    }
  },

  /**
   * Get stored refresh token
   * @returns The stored refresh token or null if not found
   */
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;

    try {
      const token = Cookies.get("refreshToken");
      return token ?? null;
    } catch (error) {
      console.error("Error retrieving token from Cookies:", error);
      return null;
    }
  },

  /**
   * Request password reset email
   * @param email - Email address to send reset link to
   * @returns Promise with forgot password response data
   */
  forgotPassword: async (
    email: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await post<ForgotPasswordResponse>(
        "/api/v1/auth/forgot-password",
        email
      );
      return response;
    } catch (error) {
      console.error("Forgot password service error:", error);
      throw error;
    }
  },

  /**
   * Reset password with new password
   * @param resetData - New password and confirmation
   * @param token - Reset token from email
   * @returns Promise with reset password response data
   */
  resetPassword: async (
    resetData: ResetPasswordRequest,
    token: string
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await post<ResetPasswordResponse>(
        `/api/v1/auth/reset-password?token=${encodeURIComponent(token)}`,
        resetData
      );
      return response;
    } catch (error) {
      console.error("Reset password service error:", error);
      throw error;
    }
  },
};

export default AuthService;
