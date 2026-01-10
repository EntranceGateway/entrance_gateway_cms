/**
 * Enhanced Axios Interceptor
 * SECURITY: Implements automatic token refresh, request/response sanitization,
 * and comprehensive error handling for authentication.
 */

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import tokenService from "../../auth/services/tokenService";
import authService from "../../auth/services/authService";
import { sanitizeObject } from "../../auth/utils/inputSanitizer";
import { resetState } from "@/store/authSlice";
import API from "../../http";

// Queue for requests waiting on token refresh
let isRefreshing = false;
let failedRequestsQueue = [];

/**
 * Process queued requests after token refresh
 * @param {string|null} token - New token or null on failure
 */
const processQueue = (token, error = null) => {
  failedRequestsQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedRequestsQueue = [];
};

/**
 * Enhanced Axios Interceptor Hook
 * Sets up request and response interceptors for security
 */
const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use refs to avoid recreating interceptors on each render
  const navigateRef = useRef(navigate);
  const dispatchRef = useRef(dispatch);

  useEffect(() => {
    navigateRef.current = navigate;
    dispatchRef.current = dispatch;
  }, [navigate, dispatch]);

  useEffect(() => {
    /**
     * Request Interceptor
     * SECURITY: Adds auth token and sanitizes outgoing data
     */
    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        // Get current access token
        const token = tokenService.getAccessToken();

        if (token) {
          // SECURITY: Add Authorization header
          config.headers.Authorization = `Bearer ${token}`;
        }

        // SECURITY: Set secure headers
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        if (!config.headers['Accept']) {
          config.headers['Accept'] = 'application/json';
        }

        // SECURITY: Sanitize request body for non-GET requests
        // Skip for FormData (file uploads) and Blobs
        if (
          config.data &&
          typeof config.data === 'object' &&
          !(config.data instanceof FormData) &&
          !(config.data instanceof Blob)
        ) {
          // Don't sanitize password fields
          const { password, confirmPassword, ...rest } = config.data;
          const sanitizedData = sanitizeObject(rest, {
            allowHtml: false,
            trimWhitespace: true,
            checkXss: true,
          });

          config.data = {
            ...sanitizedData,
            ...(password !== undefined && { password }),
            ...(confirmPassword !== undefined && { confirmPassword }),
          };
        }

        // SECURITY: Add request timeout
        config.timeout = config.timeout || 30000; // 30 second default

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    /**
     * Response Interceptor
     * SECURITY: Handles 401 errors, token refresh, and response sanitization
     */
    const responseInterceptor = API.interceptors.response.use(
      (response) => {
        const contentType = response.headers['content-type'];

        // SECURITY NOTE: We do NOT sanitize response data here anymore.
        // The previous implementation was aggressively HTML-encoding all strings (e.g. "/" -> "&#x2F;"),
        // which caused data corruption in the UI.
        // React already safeguards against XSS in JSX rendering.
        // If specific data needs sanitization, it should be done at the component level or by the backend.

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          // IMPORTANT: Skip token refresh for auth endpoints (login, register, refresh)
          // These should pass errors directly to the calling service.
          const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
          if (isAuthEndpoint) {
            return Promise.reject(error);
          }

          // Check if this is already a retry
          if (originalRequest._retry) {
            // Token refresh already tried - force logout
            tokenService.clearTokens();
            dispatchRef.current(resetState());
            navigateRef.current("/admin/login", {
              replace: true,
              state: { error: "Session expired. Please log in again." },
            });
            return Promise.reject(error);
          }

          // Check if we're already refreshing
          if (isRefreshing) {
            // Queue this request to retry after refresh completes
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return API(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          // Try to refresh the token
          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const result = await authService.refreshAccessToken();

            if (result.success && result.token) {
              // Update the original request with new token
              originalRequest.headers.Authorization = `Bearer ${result.token}`;

              // Process queued requests
              processQueue(result.token);

              isRefreshing = false;

              // Retry the original request
              return API(originalRequest);
            } else {
              // Refresh failed
              processQueue(null, new Error('Token refresh failed'));
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            isRefreshing = false;
            processQueue(null, refreshError);

            // Force logout on refresh failure
            tokenService.clearTokens();
            dispatchRef.current(resetState());
            navigateRef.current("/admin/login", {
              replace: true,
              state: { error: "Session expired. Please log in again." },
            });

            return Promise.reject(refreshError);
          }
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
          console.warn('Access forbidden:', error.config?.url);
          // Could navigate to an access denied page
        }

        // Handle 429 Too Many Requests
        if (error.response?.status === 429) {
          console.warn('Rate limited:', error.config?.url);
          // Could show a rate limit notification
        }

        // Handle network errors
        if (!error.response) {
          console.error('Network error:', error.message);
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      API.interceptors.request.eject(requestInterceptor);
      API.interceptors.response.eject(responseInterceptor);
    };
  }, []);
};

export default useAxiosInterceptor;
