import { post } from "./api";
import { LoginRequest, LoginResponse } from "@/interfaces/auth";

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
    return await post<LoginResponse>("/api/v1/auth/login", credentials);
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

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Set session expiration based on remember me option
    if (remember) {
      // Store a flag to indicate "remember me" was selected
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }
  },

  /**
   * Clear authentication tokens from storage on logout
   */
  clearTokens: (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user has a valid token
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("accessToken");
    return !!token;
  },

  /**
   * Get stored access token
   * @returns The stored access token or null if not found
   */
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("accessToken");
  },

  /**
   * Get stored refresh token
   * @returns The stored refresh token or null if not found
   */
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("refreshToken");
  },
};

export default AuthService;
