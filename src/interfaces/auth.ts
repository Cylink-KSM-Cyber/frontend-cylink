/**
 * User interface
 */
export interface User {
  id: number;
  email: string;
  name: string;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  is_verified?: boolean;
}

/**
 * Login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request interface
 */
export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  username: string;
}

/**
 * Register response interface
 *
 * Represents the response structure for user registration as returned by the backend API. The data field contains the user object directly, matching the backend response.
 *
 * @module interfaces/auth
 */
export interface RegisterResponse {
  status: number;
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * API Login response interface (from server)
 */
export interface ApiLoginResponse {
  status: number;
  message: string;
  data: {
    user: User;
    token: {
      access: string;
      refresh: string;
    };
  };
}

/**
 * Login response interface (formatted for frontend)
 */
export interface LoginResponse {
  status: number;
  message: string;
  data: {
    user: User;
    tokens: {
      access_token: string;
      refresh_token: string;
    };
  };
}

/**
 * Forgot password request interface
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Forgot password response interface
 */
export interface ForgotPasswordResponse {
  status: number;
  message: string;
  data?: {
    message: string;
  };
}

/**
 * Reset password request interface
 */
export interface ResetPasswordRequest {
  password: string;
  password_confirmation: string;
}

/**
 * Reset password response interface
 */
export interface ResetPasswordResponse {
  status: number;
  message: string;
  data?: {
    message: string;
  };
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest, remember?: boolean) => Promise<void>;
  signup: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
}
