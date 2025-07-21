import { post } from "./api";
import {
  LoginRequest,
  ApiLoginResponse,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
} from "@/interfaces/auth";
import Cookies from "js-cookie";

/**
 * Authentication Service
 *
 * Provides methods for authentication-related API calls such as login, registration, password reset, and token management. This service acts as an abstraction layer between the frontend and backend authentication endpoints, ensuring consistent and robust handling of authentication logic throughout the application.
 *
 * @module services/auth
 */
const AuthService = {
  /**
   * Register a new user
   *
   * Registers a new user with the provided credentials. Handles response validation and ensures the frontend receives a consistent structure. Now matches backend response structure directly.
   *
   * @param credentials - User registration data containing email, password, and username
   * @returns Promise with registration response data
   */
  signup: async (credentials: RegisterRequest): Promise<RegisterResponse> => {
    try {
      console.log("Sending registration request:", {
        email: credentials.email,
        username: credentials.username,
        passwordLength: credentials.password?.length,
        password_confirmationLength: credentials.password_confirmation?.length,
      });

      // Call API with registration data
      const response = await post<RegisterResponse>("/api/v1/auth/register", {
        email: credentials.email,
        password: credentials.password,
        username: credentials.username,
        password_confirmation: credentials.password_confirmation,
      });

      console.log("Registration API response:", response);

      // Validate response structure (minimal)
      if (!response || typeof response !== "object") {
        console.error("Invalid registration response structure:", response);
        throw new Error("Invalid response from server");
      }

      // No longer expect user or verification_token fields
      // Optionally, normalize data here if needed by frontend
      // Normalisasi agar data.user selalu ada
      let normalizedResponse = response;
      if (
        response &&
        response.data &&
        // Gunakan optional chaining dan cek jika response.data.id ada, bukan response.data.user
        !("user" in response.data) &&
        "id" in response.data
      ) {
        const data: Record<string, unknown> = response.data;
        normalizedResponse = {
          ...response,
          data: {
            user: {
              id: data.id as number,
              email: data.email as string,
              name: (data.username as string) || (data.name as string) || "",
              email_verified_at: (data.email_verified_at as string) || null,
              created_at: (data.created_at as string) || "",
              updated_at: (data.updated_at as string) || "",
              is_verified: (data.is_verified as boolean) || false,
            },
            verification_token: (data.verification_token as string) || "",
          },
        };
      }
      return normalizedResponse;
    } catch (error) {
      console.error("Registration service error:", error);
      throw error;
    }
  },

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
   * Save user data to local storage
   * @param user - User data to save
   */
  saveUser: (user: User): void => {
    if (typeof window === "undefined") return;

    try {
      console.log("Saving user data:", user);
      Cookies.set("userData", JSON.stringify(user));
      console.log("User data saved successfully to cookies");

      // Verify the data was saved correctly
      const savedData = Cookies.get("userData");
      console.log("Verification - saved data:", savedData);
    } catch (error) {
      console.error("Error saving user data to Cookies:", error);
      throw new Error("Failed to save user data");
    }
  },

  /**
   * Get stored user data
   * @returns The stored user data or null if not found
   */
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;

    try {
      const userData = Cookies.get("userData");
      console.log("Retrieved raw user data from cookies:", userData);

      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("Parsed user data:", parsedData);
        return parsedData;
      } else {
        console.log("No user data found in cookies");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user data from Cookies:", error);
      return null;
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
      Cookies.remove("userData");
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
