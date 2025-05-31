/**
 * Interface for login request payload
 * @description Represents the data structure for login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface for user data
 * @description Represents user data returned from API
 */
export interface User {
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/**
 * Interface for authentication tokens
 * @description Contains access and refresh tokens (original interface)
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Interface for actual API authentication tokens
 * @description Matches the actual API response structure for tokens
 */
export interface ApiAuthTokens {
  type: string;
  access: string;
  refresh: string;
  expiresAt: string | null;
}

/**
 * Interface for login response data (original interface)
 * @description Contains user data and authentication tokens
 */
export interface LoginResponseData {
  user: User;
  tokens: AuthTokens;
}

/**
 * Interface for actual API login response data
 * @description Matches the actual API response structure
 */
export interface ApiLoginResponseData {
  user: User;
  token: ApiAuthTokens;
}

/**
 * Interface for API response
 * @description Generic API response structure
 * @template T - Type of data contained in the response
 */
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Type for login response based on original interface
 * @description API response for login endpoint
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

/**
 * Type for actual API login response
 * @description API response matching the actual structure
 */
export type ApiLoginResponse = ApiResponse<ApiLoginResponseData>;

/**
 * Interface for authentication context
 * @description Represents the authentication state and methods
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

/**
 * Interface for forgot password request payload
 * @description Represents the data structure for forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Interface for forgot password response data
 * @description Represents the data returned from forgot password API
 */
export interface ForgotPasswordResponseData {
  message: string;
}

/**
 * Type for forgot password response
 * @description API response for forgot password endpoint
 */
export type ForgotPasswordResponse = ApiResponse<ForgotPasswordResponseData>;
