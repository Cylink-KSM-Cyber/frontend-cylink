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

        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          // Here we could fetch the user profile if needed
          // For now, we'll just set isAuthenticated state
          // In a real app, you might want to validate the token or fetch user data
          // For demo purposes, we'll just set isLoading to false
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        AuthService.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

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
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.login(credentials);
      const { user, tokens } = response.data;

      // Save authentication data
      AuthService.saveTokens(
        tokens.access_token,
        tokens.refresh_token,
        remember
      );
      setUser(user);

      // Navigate to dashboard after successful login
      router.push("/dashboard");
    } catch (err) {
      // Handle different error cases
      const error = err as AxiosError;
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError(
              "Invalid credentials. Please check your email and password."
            );
            break;
          case 401:
            setError(
              "Your account is not verified. Please check your email for verification instructions."
            );
            break;
          case 404:
            setError(
              "Account not found. Please check your email or register for a new account."
            );
            break;
          default:
            setError("An error occurred during login. Please try again later.");
        }
      } else {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   * @description Clears user session and redirects to login page
   */
  const logout = () => {
    AuthService.clearTokens();
    setUser(null);
    router.push("/login");
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
