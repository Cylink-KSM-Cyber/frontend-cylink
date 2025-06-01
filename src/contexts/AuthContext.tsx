"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { User, LoginRequest, AuthContextType } from "@/interfaces/auth";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastContext";
import { ToastType } from "@/components/atoms/Toast";

// Navigation delay to allow toast to be visible
const NAVIGATION_DELAY = 2000;
// Toast duration should be longer than navigation delay
const TOAST_DURATION = NAVIGATION_DELAY + 500;

/**
 * Initial authentication context state
 */
const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null,
};

/**
 * Authentication context
 * @description Context for authentication state and methods
 */
export const AuthContext = createContext<AuthContextType>(initialState);

/**
 * Authentication provider props
 * @interface AuthProviderProps
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider
 * @description Provides authentication state and methods to all children
 * @param props - Provider properties
 * @returns Authentication provider
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const { showToast, clearAllToasts } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Only run on client side
        if (typeof window === "undefined") {
          setIsLoading(false);
          return;
        }

        // Check if user is authenticated and load user data
        if (AuthService.isAuthenticated()) {
          const userData = AuthService.getUser();
          if (userData) {
            setUser(userData);
            console.log("User data loaded from storage:", userData);
          } else {
            console.log("Token exists but no user data found - keeping tokens");
            // Keep tokens even if user data is missing
            // User data might be missing due to storage issues but tokens are still valid
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Only clear tokens if there's a real error, not just missing user data
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Navigate with delay function to ensure toast is seen
   * @param path - Path to navigate to
   * @param delay - Delay in milliseconds before navigation
   */
  const navigateWithDelay = (
    path: string,
    delay: number = NAVIGATION_DELAY
  ) => {
    setTimeout(() => {
      router.push(path);
    }, delay);
  };

  /**
   * Login handler
   * @description Authenticates user with provided credentials
   * @param credentials - Login credentials
   * @param remember - Remember login option
   */
  const login = async (
    credentials: LoginRequest,
    remember: boolean = false
  ) => {
    // Clear any existing toasts
    clearAllToasts();

    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login with credentials:", {
        email: credentials.email,
        passwordLength: credentials.password?.length,
      });

      const response = await AuthService.login(credentials);
      console.log("Login response received:", {
        status: "success",
        hasUser: !!response.data?.user,
        hasTokens: !!response.data?.tokens,
      });

      const { user, tokens } = response.data;

      if (!user || !tokens) {
        console.error("Invalid response structure:", {
          hasUser: !!user,
          hasTokens: !!tokens,
        });
        throw new Error("Invalid server response");
      }

      // Save authentication data
      try {
        AuthService.saveTokens(
          tokens.access_token,
          tokens.refresh_token,
          remember
        );
        console.log("Tokens saved successfully");

        // Save user data to storage
        AuthService.saveUser(user);
        console.log("User data saved successfully:", user);
      } catch (tokenError) {
        console.error("Failed to save tokens:", tokenError);
        throw new Error("Failed to save authentication data");
      }

      setUser(user);

      // Show success toast with longer duration to ensure visibility before navigation
      showToast("Successfully logged in", "success", TOAST_DURATION);
      console.log("Success toast shown, will navigate after delay");

      // Set isLoading to false before navigation
      setIsLoading(false);

      // Navigate to dashboard after a delay to ensure toast is visible
      navigateWithDelay("/dashboard");
    } catch (err) {
      console.error("Login error details:", err);

      // Handle different error cases
      let errorMessage =
        "An error occurred during login. Please try again later.";
      const errorType: ToastType = "error";

      if (err instanceof AxiosError) {
        const error = err as AxiosError;

        if (error.response) {
          console.log("Error response status:", error.response.status);
          console.log("Error response data:", error.response.data);

          switch (error.response.status) {
            case 400:
              errorMessage =
                "Invalid credentials. Please check your email and password.";
              break;
            case 401:
              errorMessage =
                "Your account is not verified. Please check your email for verification instructions.";
              break;
            case 404:
              errorMessage =
                "Account not found. Please check your email or register for a new account.";
              break;
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response received from server");
          errorMessage = "Server did not respond. Please try again later.";
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error setting up request:", error.message);
          errorMessage =
            "Failed to connect to the server. Please check your connection.";
        }
      } else {
        // Not an Axios error
        console.log("Non-Axios error:", err);
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);

      // Show error toast with longer duration
      showToast(errorMessage, errorType, 6000);
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   * @description Clears user session and redirects to login page
   */
  const logout = () => {
    // Clear any existing toasts
    clearAllToasts();

    // Clear tokens and user data from storage
    AuthService.clearTokens();
    setUser(null);

    // Show info toast with longer duration to ensure visibility
    showToast("You have been logged out", "info", TOAST_DURATION);

    // Navigate to login page after a delay to ensure toast is visible
    navigateWithDelay("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Use authentication hook
 * @description Custom hook for accessing authentication context
 * @returns Authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
