/**
 * API Client Configuration
 * SECURITY: Centralized axios instance with secure defaults
 */

import axios from "axios";
import { API_ENDPOINTS } from "../auth/config/securityConfig";
import tokenService from "../auth/services/tokenService";

/**
 * Create axios instance with secure configuration
 * SECURITY: Configures secure defaults for all API requests
 */
const API = axios.create({
  // Use environment variable for API URL (avoid hardcoding)
  baseURL: API_ENDPOINTS.baseUrl,

  // SECURITY: Request timeout to prevent hanging requests
  timeout: 30000, // 30 seconds

  // SECURITY: Include credentials for cookie-based auth (if backend supports)
  // withCredentials: true,

  // Default headers
  headers: {
    'Accept': 'application/json',
    // Content-Type is set automatically by axios based on request body
    // Don't set it globally to allow FormData to set multipart/form-data
  },
});



/**
 * Request logging for development
 * SECURITY: Disabled in production to prevent sensitive data exposure
 */
if (import.meta.env.DEV) {
  API.interceptors.request.use((config) => {
    // Log request info (without sensitive data)
    console.debug(
      `[API] ${config.method?.toUpperCase()} ${config.url}`,
      { params: config.params }
    );
    return config;
  });

  API.interceptors.response.use(
    (response) => {
      console.debug(
        `[API] Response ${response.status}`,
        { url: response.config.url }
      );
      return response;
    },
    (error) => {
      console.debug(
        `[API] Error ${error.response?.status || 'Network'}`,
        { url: error.config?.url, message: error.message }
      );
      return Promise.reject(error);
    }
  );
}

export default API;
