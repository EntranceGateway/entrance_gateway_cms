/**
 * Enhanced Authentication Slice
 * SECURITY: Secure state management for authentication with proper token handling
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import STATUSES from '@/globals/status/statuses';
import authService from '@/auth/services/authService';
import tokenService from '@/auth/services/tokenService';
import rateLimitService from '@/auth/services/rateLimitService';

/**
 * Initial state with security-focused properties
 */
const initialState = {
  // User information
  user: null,
  userId: null,
  userRole: null,

  // Authentication status
  status: null,
  isAuthenticated: false,

  // Error handling
  error: null,
  errorCode: null,

  // Rate limiting state
  lockoutStatus: null,
  attemptsRemaining: null,

  // Token state (without storing actual tokens in Redux)
  tokenExpiry: null,
  needsRefresh: false,

  // Session state
  lastActivity: null,
  sessionValid: true,
};

/**
 * Async thunk for secure login
 * SECURITY: Uses auth service with rate limiting and input sanitization
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    const result = await authService.login(credentials);

    if (!result.success) {
      return rejectWithValue({
        error: result.error,
        errorCode: result.errorCode,
        lockoutStatus: result.lockoutStatus,
      });
    }

    return result;
  }
);

/**
 * Async thunk for secure logout
 * SECURITY: Clears all tokens and attempts server-side invalidation
 */
export const performLogout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await authService.logout();
    dispatch(resetState());
    return { success: true };
  }
);

/**
 * Async thunk for token refresh
 * SECURITY: Automatic token rotation without storing sensitive data
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    const result = await authService.refreshAccessToken();

    if (!result.success) {
      if (result.requiresLogin) {
        // Force logout on refresh failure
        return rejectWithValue({
          error: result.error,
          requiresLogin: true,
        });
      }
      return rejectWithValue({ error: result.error });
    }

    return result;
  }
);

/**
 * Async thunk for session validation
 * SECURITY: Validates session and refreshes if needed
 */
export const validateSession = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue }) => {
    const result = await authService.validateSession();

    if (!result.valid) {
      return rejectWithValue({
        error: result.error,
        requiresLogin: result.requiresLogin,
      });
    }

    return result;
  }
);

/**
 * Auth slice with enhanced security
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication status
     */
    setStatus(state, action) {
      state.status = action.payload;
    },

    /**
     * Set error message
     */
    setError(state, action) {
      state.error = action.payload;
    },

    /**
     * Set user data
     * SECURITY: Sanitized before storage
     */
    setUser(state, action) {
      state.user = action.payload;
    },

    /**
     * Update last activity timestamp
     * SECURITY: Used for session timeout detection
     */
    updateLastActivity(state) {
      state.lastActivity = Date.now();
    },

    /**
     * Set session validity
     */
    setSessionValid(state, action) {
      state.sessionValid = action.payload;
    },

    /**
     * Reset state on logout
     * SECURITY: Complete state cleanup
     */
    resetState(state) {
      Object.assign(state, initialState);
    },

    /**
     * Update lockout status from rate limiting
     */
    updateLockoutStatus(state) {
      const status = rateLimitService.checkLockout();
      state.lockoutStatus = status.isLockedOut ? status : null;
      state.attemptsRemaining = status.attemptsRemaining;
    },

    /**
     * Restore auth state from token service
     * SECURITY: Called on app init to restore session
     */
    restoreAuthState(state) {
      const authState = authService.getAuthState();
      state.isAuthenticated = authState.isAuthenticated;
      state.user = authState.user; // Restore full user object
      state.userId = authState.userId;
      state.userRole = authState.userRole;
      state.tokenExpiry = authState.tokenInfo?.expiresAt;
    },
  },

  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(login.pending, (state) => {
        state.status = STATUSES.LOADING;
        state.error = null;
        state.errorCode = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = STATUSES.SUCCESS;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.userRole = action.payload.role;
        state.error = null;
        state.errorCode = null;
        state.lockoutStatus = null;
        state.attemptsRemaining = null;
        state.lastActivity = Date.now();
        state.sessionValid = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
        state.isAuthenticated = false;
        state.error = action.payload?.error || 'Login failed';
        state.errorCode = action.payload?.errorCode;
        state.lockoutStatus = action.payload?.lockoutStatus;
        if (action.payload?.lockoutStatus) {
          state.attemptsRemaining = action.payload.lockoutStatus.attemptsRemaining;
        }
      })

      // Logout cases
      .addCase(performLogout.pending, (state) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(performLogout.fulfilled, (state) => {
        // State is reset by resetState action
        state.status = null;
      })
      .addCase(performLogout.rejected, (state) => {
        // Still reset state even on failure
        Object.assign(state, initialState);
      })

      // Token refresh cases
      .addCase(refreshToken.pending, (state) => {
        state.needsRefresh = true;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.needsRefresh = false;
        state.sessionValid = true;
        // Token service handles the actual token storage
        const authState = authService.getAuthState();
        state.tokenExpiry = authState.tokenInfo?.expiresAt;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.needsRefresh = false;
        if (action.payload?.requiresLogin) {
          // Force logout
          Object.assign(state, initialState);
        }
      })

      // Session validation cases
      .addCase(validateSession.fulfilled, (state, action) => {
        state.sessionValid = true;
        state.userId = action.payload.userId;
        state.userRole = action.payload.userRole;
        state.isAuthenticated = true;
      })
      .addCase(validateSession.rejected, (state, action) => {
        if (action.payload?.requiresLogin) {
          state.sessionValid = false;
          state.isAuthenticated = false;
        }
      });
  },
});

// Export actions
export const {
  setStatus,
  setError,
  setUser,
  updateLastActivity,
  setSessionValid,
  resetState,
  updateLockoutStatus,
  restoreAuthState,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.userRole;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectLockoutStatus = (state) => state.auth.lockoutStatus;
export const selectSessionValid = (state) => state.auth.sessionValid;

// ============================================
// LEGACY EXPORTS FOR BACKWARD COMPATIBILITY
// These maintain API compatibility with existing code
// ============================================

export const setToken = () => {
  console.warn('setToken is deprecated. Tokens are now managed by tokenService.');
  return { type: 'auth/noop' };
};

export const setUserId = (state, action) => {
  // Handled internally now
  return { type: 'auth/noop' };
};

/**
 * Legacy login function for backward compatibility
 * @deprecated Use login thunk instead
 */
export function addAuth(data) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const result = await authService.register(data);
      if (result.success) {
        dispatch(setStatus(STATUSES.SUCCESS));
      } else {
        dispatch(setStatus(STATUSES.ERROR));
        dispatch(setError(result.error));
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
      dispatch(setError('Registration failed'));
    }
  };
}
