/**
 * Authentication Service
 * Centralized authentication logic with security best practices.
 * SECURITY: All authentication operations go through this service.
 */

import API from '../../http';
import { API_ENDPOINTS } from '../config/securityConfig';
import tokenService from './tokenService';
import rateLimitService from './rateLimitService';
import { sanitizeInput, sanitizeEmail, sanitizeObject } from '../utils/inputSanitizer';
import { validatePassword } from '../utils/passwordValidator';

// Flag to prevent concurrent refresh requests
let isRefreshing = false;
let refreshPromise = null;

/**
 * Login with email and password
 * SECURITY: Implements rate limiting, input sanitization, and secure token storage
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} Login result
 */
export async function login({ email, password }) {
  // Check rate limiting first
  const canAttempt = rateLimitService.canAttemptLogin();
  if (!canAttempt.allowed) {
    return {
      success: false,
      error: canAttempt.message,
      errorCode: canAttempt.reason,
      lockoutStatus: rateLimitService.checkLockout(),
    };
  }

  // Sanitize email input
  // SECURITY: Prevents injection attacks through email field
  const sanitizedEmail = sanitizeEmail(email);
  if (!sanitizedEmail.valid) {
    return {
      success: false,
      error: sanitizedEmail.error,
      errorCode: 'invalid_email',
    };
  }

  // Validate password is present (don't validate strength for login - only for registration)
  if (!password || typeof password !== 'string' || password.length === 0) {
    return {
      success: false,
      error: 'Password is required',
      errorCode: 'missing_password',
    };
  }

  try {
    const response = await API.post(API_ENDPOINTS.auth.login, {
      email: sanitizedEmail.value,
      password, // Send password as-is, never log or store
    });

    // Check for token in various possible response formats
    const responseData = response.data?.data || response.data;
    // Support both 'accessToken' (new) and 'token' (legacy) keys
    const accessToken = responseData?.accessToken || responseData?.token;

    if (response.status === 200 && accessToken) {
      let { refreshToken, userId, user, expiresIn } = responseData;
      let userRole = user?.role;

      // If key user data is missing, try to extract from token
      if (!userRole || !userId) {
        const payload = tokenService.parseJwt(accessToken);
        if (payload) {
          // Map standard JWT claims to our needs
          userRole = userRole || payload.role || payload.roles || 'admin';
          userId = userId || payload.userId || payload.sub; // 'sub' is standard subject
        }
      }

      // Fallback
      userRole = userRole || 'admin';

      // Store tokens securely
      tokenService.storeTokens({
        accessToken: accessToken,
        refreshToken: refreshToken || null,
        userId,
        userRole: userRole,
        expiresIn,
      });

      // Clear rate limiting on success
      rateLimitService.recordSuccessfulLogin();

      return {
        success: true,
        user: sanitizeObject(user || {}), // Sanitize user data from server
        userId,
        token: accessToken,
        role: userRole,
      };
    }

    // Unexpected response format
    rateLimitService.recordFailedAttempt();
    return {
      success: false,
      error: 'Login failed. Please try again.',
      errorCode: 'unexpected_response',
      lockoutStatus: rateLimitService.checkLockout(),
    };
  } catch (error) {
    // Handle different error types
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    const serverLockout = error.response?.data?.lockoutUntil;

    // Record failed attempt
    rateLimitService.recordFailedAttempt(serverLockout);
    const lockoutStatus = rateLimitService.checkLockout();

    // Map error responses
    // SECURITY: Don't reveal whether email exists (timing attack prevention)
    let errorMessage = 'Invalid credentials';
    let errorCode = 'invalid_credentials';

    if (status === 401) {
      errorMessage = 'Invalid email or password';
      errorCode = 'invalid_credentials';
    } else if (status === 403) {
      errorMessage = serverMessage || 'Account is locked or disabled';
      errorCode = 'account_locked';
    } else if (status === 429) {
      errorMessage = serverMessage || 'Too many attempts. Please try again later.';
      errorCode = 'rate_limited';
    } else if (status >= 500) {
      errorMessage = 'Server error. Please try again later.';
      errorCode = 'server_error';
    } else if (!error.response) {
      errorMessage = 'Network error. Please check your connection.';
      errorCode = 'network_error';
    }

    return {
      success: false,
      error: errorMessage,
      errorCode,
      lockoutStatus,
    };
  }
}

/**
 * Logout and invalidate tokens
 * SECURITY: Clears all tokens and attempts server-side invalidation
 * @returns {Promise<Object>} Logout result
 */
export async function logout() {
  const refreshToken = tokenService.getRefreshToken();

  // Always clear local tokens first (even if server call fails)
  tokenService.clearTokens();
  rateLimitService.resetRateLimit();

  // Attempt server-side logout
  try {
    if (refreshToken) {
      await API.post(API_ENDPOINTS.auth.logout, { refreshToken });
    }
  } catch (error) {
    // Log but don't fail - local cleanup is sufficient
    console.warn('Server logout failed:', error.message);
  }

  return { success: true };
}

/**
 * Refresh access token
 * SECURITY: Uses refresh token to get new access token without re-authentication
 * @returns {Promise<Object>} Refresh result
 */
export async function refreshAccessToken() {
  // Prevent concurrent refresh requests
  if (isRefreshing) {
    return refreshPromise;
  }

  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) {
    return {
      success: false,
      error: 'No refresh token available',
      errorCode: 'no_refresh_token',
    };
  }

  isRefreshing = true;
  refreshPromise = performTokenRefresh(refreshToken);

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Perform the actual token refresh
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} Refresh result
 */
async function performTokenRefresh(refreshToken) {
  try {
    const response = await API.post(API_ENDPOINTS.auth.refresh, { 
      refreshToken 
    });

    if (response.status === 200 && response.data?.data?.token) {
      const { token, expiresIn, newRefreshToken } = response.data.data;

      // Update tokens
      if (newRefreshToken) {
        // Token rotation - store new refresh token
        tokenService.storeTokens({
          accessToken: token,
          refreshToken: newRefreshToken,
          userId: tokenService.getUserId(),
          userRole: tokenService.getUserRole(),
          expiresIn,
        });
      } else {
        // Just update access token
        tokenService.updateAccessToken(token, expiresIn);
      }

      return {
        success: true,
        token,
      };
    }

    return {
      success: false,
      error: 'Token refresh failed',
      errorCode: 'refresh_failed',
    };
  } catch (error) {
    const status = error.response?.status;

    // If refresh token is invalid/expired, force logout
    if (status === 401 || status === 403) {
      tokenService.clearTokens();
      return {
        success: false,
        error: 'Session expired. Please log in again.',
        errorCode: 'session_expired',
        requiresLogin: true,
      };
    }

    return {
      success: false,
      error: 'Token refresh failed. Please try again.',
      errorCode: 'refresh_error',
    };
  }
}

/**
 * Validate current session
 * @returns {Promise<Object>} Validation result
 */
export async function validateSession() {
  const token = tokenService.getAccessToken();
  
  if (!token) {
    return {
      valid: false,
      error: 'No active session',
    };
  }

  // Check if token is expired locally first
  if (tokenService.isTokenExpired()) {
    // Try to refresh
    const refreshResult = await refreshAccessToken();
    if (!refreshResult.success) {
      return {
        valid: false,
        error: refreshResult.error,
        requiresLogin: refreshResult.requiresLogin,
      };
    }
  }

  return {
    valid: true,
    userId: tokenService.getUserId(),
    userRole: tokenService.getUserRole(),
  };
}

/**
 * Register new admin (if allowed)
 * SECURITY: Strong password validation required
 * @param {Object} data - Registration data
 * @returns {Promise<Object>} Registration result
 */
export async function register({ email, password, confirmPassword, name }) {
  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return {
      success: false,
      error: 'Password does not meet security requirements',
      errorCode: 'weak_password',
      passwordErrors: passwordValidation.errors,
    };
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Passwords do not match',
      errorCode: 'password_mismatch',
    };
  }

  // Sanitize inputs
  const sanitizedEmail = sanitizeEmail(email);
  if (!sanitizedEmail.valid) {
    return {
      success: false,
      error: sanitizedEmail.error,
      errorCode: 'invalid_email',
    };
  }

  const sanitizedName = sanitizeInput(name);

  try {
    const response = await API.post(API_ENDPOINTS.auth.register, {
      email: sanitizedEmail.value,
      password,
      name: sanitizedName.value,
    });

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: 'Registration successful',
      };
    }

    return {
      success: false,
      error: 'Registration failed',
      errorCode: 'registration_failed',
    };
  } catch (error) {
    const serverMessage = error.response?.data?.message;
    return {
      success: false,
      error: serverMessage || 'Registration failed. Please try again.',
      errorCode: 'registration_error',
    };
  }
}

/**
 * Check if user has required role
 * SECURITY: Role-based access control check
 * @param {string|string[]} requiredRoles - Required role(s)
 * @returns {boolean} Whether user has required role
 */
export function hasRole(requiredRoles) {
  const userRole = tokenService.getUserRole();
  if (!userRole) return false;

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole);
}

/**
 * Get current authentication state
 * @returns {Object} Current auth state
 */
export function getAuthState() {
  return {
    isAuthenticated: tokenService.isAuthenticated(),
    userId: tokenService.getUserId(),
    userRole: tokenService.getUserRole(),
    tokenInfo: tokenService.getTokenInfo(),
  };
}

// Listen for token refresh events
if (typeof window !== 'undefined') {
  window.addEventListener('tokenRefreshNeeded', async () => {
    const result = await refreshAccessToken();
    if (!result.success && result.requiresLogin) {
      // Dispatch event for app to handle
      window.dispatchEvent(new CustomEvent('authSessionExpired'));
    }
  });
}

export default {
  login,
  logout,
  refreshAccessToken,
  validateSession,
  register,
  hasRole,
  getAuthState,
};
