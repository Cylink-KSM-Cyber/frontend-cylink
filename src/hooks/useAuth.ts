import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";
import { LoginRequest, User } from "@/interfaces/auth";
import { AxiosError } from "axios";
import { useToast } from "@/contexts/ToastContext";

/**
 * Custom hook for authentication
 * @description Manages authentication state and provides login/logout functionality
 * @returns Authentication state and methods
 */
const useAuth = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login handler
   * @description Attempts to authenticate user with provided credentials
   * @param credentials - Login credentials (email and password)
   * @param remember - Whether to persist login session
   */
  const login = useCallback(
    async (credentials: LoginRequest, remember: boolean = false) => {
      console.log("Login attempt started", { email: credentials.email });
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

        // Show success toast and delay navigation
        console.log("Login successful, showing success toast");
        showToast("Successfully logged in", "success");

        // Delay navigation to allow toast to be visible
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } catch (err) {
        // Handle different error cases
        const error = err as AxiosError;
        let errorMessage =
          "An error occurred during login. Please try again later.";

        if (error.response) {
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
        } else {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        }

        setError(errorMessage);
        // Show error toast
        showToast(errorMessage, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [router, showToast]
  );

  /**
   * Logout handler
   * @description Clears user session and redirects to login page
   */
  const logout = useCallback(() => {
    AuthService.clearTokens();
    setUser(null);
    showToast("You have been logged out", "info");
    router.push("/login");
  }, [router, showToast]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
  };
};

export default useAuth;
