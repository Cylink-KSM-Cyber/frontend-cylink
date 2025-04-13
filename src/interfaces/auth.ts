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
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
}

/**
 * Interface for authentication tokens
 * @description Contains access and refresh tokens
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

/**
 * Interface for login response data
 * @description Contains user data and authentication tokens
 */
export interface LoginResponseData {
  user: User;
  tokens: AuthTokens;
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
 * Type for login response
 * @description API response for login endpoint
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

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
