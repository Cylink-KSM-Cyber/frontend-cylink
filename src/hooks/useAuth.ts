import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";
import { LoginRequest, User } from "@/interfaces/auth";
import { AxiosError } from "axios";

/**
 * Custom hook for authentication
 * @description Manages authentication state and provides login/logout functionality
 * @returns Authentication state and methods
 */
const useAuth = () => {
  const router = useRouter();
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
              setError(
                "An error occurred during login. Please try again later."
              );
          }
        } else {
          setError(
            "Network error. Please check your internet connection and try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  /**
   * Logout handler
   * @description Clears user session and redirects to login page
   */
  const logout = useCallback(() => {
    AuthService.clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

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
