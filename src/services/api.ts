import axios, { AxiosError, AxiosRequestConfig } from "axios";

/**
 * Base API configuration
 * @description Axios instance with base configuration for API calls
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for API calls
 * @description Adds authentication token to request headers if available
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 * @description Handles common response processing and error handling
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle 401 error (unauthorized) - could redirect to login or refresh token
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
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
  const response = await api.get<T>(url, config);
  return response.data;
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
  const response = await api.post<T>(url, data, config);
  return response.data;
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
  const response = await api.put<T>(url, data, config);
  return response.data;
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
  const response = await api.delete<T>(url, config);
  return response.data;
};

export default api;
