import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

/**
 * Base API configuration
 * @description Axios instance with base configuration for API calls
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  // Add a timeout to prevent hanging requests
  timeout: 30000,
});

/**
 * Check if we're in a browser environment
 * @returns true if in browser, false if on server
 */
const isBrowser = () => typeof window !== "undefined";

/**
 * Get token safely from Cookies
 * @returns The token or null if not available
 */
export const getToken = (): string | null => {
  if (!isBrowser()) return null;

  try {
    const token = Cookies.get("accessToken");
    console.log(token);

    return token === undefined ? null : token;
  } catch (error) {
    console.error("Error retrieving token from Cookies:", error);
    return null;
  }
};

/**
 * Request interceptor for API calls
 * @description Adds authentication token to request headers if available
 */
api.interceptors.request.use(
  (config) => {
    try {
      if (isBrowser()) {
        const token = getToken();
        if (token && config.headers) {
          // Set authorization header safely
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    } catch (error) {
      console.error("Request interceptor error:", error);
      return config; // Still try to proceed with the request
    }
  },
  (error) => {
    console.error("Request interceptor rejection:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 * @description Handles common response processing and error handling
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    try {
      // Log successful responses for debugging
      console.log(
        `API Response [${response.config.method?.toUpperCase()}] ${
          response.config.url
        }:`,
        {
          status: response.status,
          statusText: response.statusText,
          hasData: !!response.data,
        }
      );

      return response;
    } catch (error) {
      console.error("Response interceptor error:", error);
      return response; // Still return the response
    }
  },
  (error: AxiosError) => {
    try {
      // Handle common error cases
      if (error.response) {
        console.error(
          `API Error [${error.config?.method?.toUpperCase()}] ${
            error.config?.url
          }:`,
          {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          }
        );

        // Handle authentication errors
        if (error.response.status === 401) {
          if (isBrowser()) {
            try {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
            } catch (storageError) {
              console.error("Error removing tokens:", storageError);
            }
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
      }
    } catch (interceptorError) {
      console.error("Error in response error interceptor:", interceptorError);
    }

    return Promise.reject(error);
  }
);

/**
 * Generic GET request
 * @description Makes a GET request to the specified endpoint
 * @param url - API endpoint
 * @param config - Axios request configuration
 * @returns Promise with the response data
 */
export const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    console.log(`Making GET request to ${url}`);
    const response = await api.get<T>(url, config);
    console.log(`GET ${url} response status:`, response.status);
    console.log(`GET ${url} response data:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`GET ${url} failed:`, error);
    throw error;
  }
};

/**
 * Generic POST request
 * @description Makes a POST request to the specified endpoint
 * @param url - API endpoint
 * @param data - Request payload
 * @param config - Axios request configuration
 * @returns Promise with the response data
 */
export const post = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`POST ${url} failed:`, error);
    throw error;
  }
};

/**
 * Generic PUT request
 * @description Makes a PUT request to the specified endpoint
 * @param url - API endpoint
 * @param data - Request payload
 * @param config - Axios request configuration
 * @returns Promise with the response data
 */
export const put = async <T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`PUT ${url} failed:`, error);
    throw error;
  }
};

/**
 * Generic DELETE request
 * @description Makes a DELETE request to the specified endpoint
 * @param url - API endpoint
 * @param config - Axios request configuration
 * @returns Promise with the response data
 */
export const del = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await api.delete<T>(url, config);
    return response.data;
  } catch (error) {
    console.error(`DELETE ${url} failed:`, error);
    throw error;
  }
};

export default api;
