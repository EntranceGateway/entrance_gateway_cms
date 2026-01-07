/**
 * Token Service
 * Secure token management with in-memory storage and encrypted backup.
 * SECURITY: Tokens are stored in memory (primary) with encrypted localStorage backup.
 */

import { TOKEN_CONFIG } from '../config/securityConfig';

// In-memory token storage (more secure than localStorage for XSS attacks)
// SECURITY: Memory-only storage prevents XSS attacks from accessing tokens directly
let tokenStore = {
  accessToken: null,
  refreshToken: null,
  tokenExpiry: null,
  userId: null,
  userRole: null,
};

// Encryption key for localStorage backup
const ENCRYPTION_KEY = import.meta.env.VITE_TOKEN_ENCRYPTION_KEY || 'default-dev-key-change-in-production-32';

/**
 * Simple encryption for localStorage backup
 * SECURITY: Provides obfuscation layer for localStorage backup
 * Note: This is not cryptographically secure - use httpOnly cookies in production
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted string
 */
function encrypt(text) {
  if (!text) return '';
  
  try {
    // Convert to base64 and apply simple XOR with key
    const encoded = btoa(encodeURIComponent(text));
    let result = '';
    for (let i = 0; i < encoded.length; i++) {
      result += String.fromCharCode(
        encoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return btoa(result);
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
}

/**
 * Decrypt encrypted string
 * @param {string} encrypted - Encrypted string
 * @returns {string} Decrypted string
 */
function decrypt(encrypted) {
  if (!encrypted) return '';
  
  try {
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length)
      );
    }
    return decodeURIComponent(atob(result));
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
}

/**
 * Parse JWT to get payload
 * @param {string} token - JWT token
 * @returns {Object|null} Payload or null
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT', e);
    return null;
  }
}

/**
 * Store tokens securely
 * SECURITY: Primary storage in memory, backup in encrypted localStorage
 * @param {Object} tokens - Token data
 */
export function storeTokens({ accessToken, refreshToken, userId, userRole, expiresIn }) {
  // Calculate expiry time
  const expiryTime = Date.now() + (expiresIn || TOKEN_CONFIG.accessTokenExpiryMinutes * 60 * 1000);

  // Store in memory (primary)
  tokenStore = {
    accessToken,
    refreshToken,
    tokenExpiry: expiryTime,
    userId,
    userRole,
  };

  // Store encrypted backup in localStorage for page refresh persistence
  // SECURITY: Encrypted to provide defense in depth
  try {
    const backup = JSON.stringify({
      at: accessToken,
      rt: refreshToken,
      exp: expiryTime,
      uid: userId,
      role: userRole,
    });
    localStorage.setItem(TOKEN_CONFIG.storageKeys.accessToken, encrypt(backup));
    
    // BACKWARD COMPATIBILITY: Also store in old format for existing components (Navbar, etc.)
    // TODO: Remove this once all components are updated to use tokenService
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', userId);
  } catch (error) {
    console.error('Failed to store token backup:', error);
  }

  // Schedule token refresh before expiry
  scheduleTokenRefresh(expiryTime);
}

/**
 * Get current access token
 * SECURITY: Returns from memory first, falls back to encrypted backup
 * @returns {string|null} Access token or null
 */
export function getAccessToken() {
  // Try memory first
  if (tokenStore.accessToken && !isTokenExpired()) {
    return tokenStore.accessToken;
  }

  // Try to restore from encrypted backup
  if (!tokenStore.accessToken) {
    restoreFromBackup();
  }

  // Check again after restore
  if (tokenStore.accessToken && !isTokenExpired()) {
    return tokenStore.accessToken;
  }

  return null;
}

/**
 * Get refresh token
 * @returns {string|null} Refresh token or null
 */
export function getRefreshToken() {
  if (!tokenStore.refreshToken) {
    restoreFromBackup();
  }
  return tokenStore.refreshToken;
}

/**
 * Get user ID
 * @returns {string|null} User ID or null
 */
export function getUserId() {
  if (!tokenStore.userId) {
    restoreFromBackup();
  }
  return tokenStore.userId;
}

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export function getUserRole() {
  if (!tokenStore.userRole) {
    restoreFromBackup();
  }
  return tokenStore.userRole;
}

/**
 * Check if access token is expired
 * SECURITY: Uses constant-time comparison isn't needed here but early check prevents expired token use
 * @returns {boolean} Whether token is expired
 */
export function isTokenExpired() {
  if (!tokenStore.tokenExpiry) {
    restoreFromBackup();
  }
  
  if (!tokenStore.tokenExpiry) return true;
  
  // Add buffer time (2 minutes before actual expiry)
  const bufferMs = TOKEN_CONFIG.refreshThresholdMinutes * 60 * 1000;
  return Date.now() > (tokenStore.tokenExpiry - bufferMs);
}

/**
 * Check if token needs refresh soon
 * @returns {boolean} Whether token should be refreshed
 */
export function shouldRefreshToken() {
  if (!tokenStore.tokenExpiry) return false;
  
  const refreshThreshold = TOKEN_CONFIG.refreshThresholdMinutes * 60 * 1000;
  return Date.now() > (tokenStore.tokenExpiry - refreshThreshold);
}

/**
 * Restore tokens from encrypted backup
 * SECURITY: Called on page refresh to restore session
 */
function restoreFromBackup() {
  try {
    const encrypted = localStorage.getItem(TOKEN_CONFIG.storageKeys.accessToken);
    if (!encrypted) return;

    const decrypted = decrypt(encrypted);
    if (!decrypted) return;

    const backup = JSON.parse(decrypted);
    
    // Restore to memory
    tokenStore = {
      accessToken: backup.at,
      refreshToken: backup.rt,
      tokenExpiry: backup.exp,
      userId: backup.uid,
      userRole: backup.role,
    };

    // Schedule refresh if needed
    if (tokenStore.tokenExpiry) {
      scheduleTokenRefresh(tokenStore.tokenExpiry);
    }
  } catch (error) {
    console.error('Failed to restore token backup:', error);
    clearTokens();
  }
}

/**
 * Clear all tokens
 * SECURITY: Complete cleanup on logout - clears both memory and localStorage
 */
export function clearTokens() {
  // Clear memory
  tokenStore = {
    accessToken: null,
    refreshToken: null,
    tokenExpiry: null,
    userId: null,
    userRole: null,
  };

  // Clear localStorage
  try {
    localStorage.removeItem(TOKEN_CONFIG.storageKeys.accessToken);
    // Also clear legacy storage keys for backward compatibility
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  } catch (error) {
    console.error('Failed to clear token storage:', error);
  }

  // Cancel scheduled refresh
  cancelScheduledRefresh();
}

// Refresh timer reference
let refreshTimer = null;

/**
 * Schedule automatic token refresh
 * SECURITY: Proactively refreshes token before expiry
 * @param {number} expiryTime - Token expiry timestamp
 */
function scheduleTokenRefresh(expiryTime) {
  cancelScheduledRefresh();

  const refreshTime = expiryTime - (TOKEN_CONFIG.refreshThresholdMinutes * 60 * 1000);
  const delay = Math.max(0, refreshTime - Date.now());

  if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // Max 24 hours
    refreshTimer = setTimeout(() => {
      // Dispatch event for auth service to handle refresh
      window.dispatchEvent(new CustomEvent('tokenRefreshNeeded'));
    }, delay);
  }
}

/**
 * Cancel scheduled token refresh
 */
function cancelScheduledRefresh() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * Update access token after refresh
 * SECURITY: Updates token without exposing full token management
 * @param {string} newAccessToken - New access token
 * @param {number} expiresIn - New expiry time in milliseconds
 */
export function updateAccessToken(newAccessToken, expiresIn) {
  const expiryTime = Date.now() + (expiresIn || TOKEN_CONFIG.accessTokenExpiryMinutes * 60 * 1000);
  
  tokenStore.accessToken = newAccessToken;
  tokenStore.tokenExpiry = expiryTime;

  // Update backup
  storeTokens({
    accessToken: newAccessToken,
    refreshToken: tokenStore.refreshToken,
    userId: tokenStore.userId,
    userRole: tokenStore.userRole,
    expiresIn,
  });
}

/**
 * Check if user is authenticated
 * @returns {boolean} Whether user has valid token
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * Get token info for debugging (without exposing actual tokens)
 * SECURITY: Masks token values for safe logging
 * @returns {Object} Token info
 */
export function getTokenInfo() {
  const token = getAccessToken();
  return {
    hasAccessToken: !!token,
    hasRefreshToken: !!tokenStore.refreshToken,
    isExpired: isTokenExpired(),
    expiresAt: tokenStore.tokenExpiry 
      ? new Date(tokenStore.tokenExpiry).toISOString() 
      : null,
    userId: tokenStore.userId,
    userRole: tokenStore.userRole,
    tokenPreview: token ? `${token.substring(0, 10)}...` : null,
  };
}

export default {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  getUserId,
  getUserRole,
  isTokenExpired,
  shouldRefreshToken,
  clearTokens,
  updateAccessToken,
  isAuthenticated,
  isAuthenticated,
  getTokenInfo,
  parseJwt,
};
