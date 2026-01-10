/**
 * Security Configuration
 * Central configuration file for all authentication and security settings.
 * SECURITY: All sensitive values should be loaded from environment variables.
 */

// Password requirements following OWASP guidelines
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  // Special characters allowed in passwords
  specialCharacters: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// Token configuration
export const TOKEN_CONFIG = {
  // Access token expiry in minutes (should match backend)
  accessTokenExpiryMinutes: parseInt(import.meta.env.VITE_ACCESS_TOKEN_EXPIRY_MINUTES) || 15,
  // Refresh token expiry in days (should match backend)
  refreshTokenExpiryDays: parseInt(import.meta.env.VITE_REFRESH_TOKEN_EXPIRY_DAYS) || 7,
  // Time before expiry to trigger refresh (in minutes)
  refreshThresholdMinutes: 2,
  // Storage keys
  storageKeys: {
    accessToken: 'eg_at',
    refreshToken: 'eg_rt',
    tokenExpiry: 'eg_exp',
    userId: 'eg_uid',
  },
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // Maximum failed login attempts before lockout
  maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5,
  // Lockout duration in minutes
  lockoutDurationMinutes: parseInt(import.meta.env.VITE_LOCKOUT_DURATION_MINUTES) || 15,
  // Progressive delay multiplier (exponential backoff)
  delayMultiplier: 2,
  // Initial delay in seconds after first failed attempt
  initialDelaySeconds: 1,
  // Storage key for tracking attempts
  storageKey: 'eg_login_attempts',
};

// Session configuration
export const SESSION_CONFIG = {
  // Session timeout in minutes of inactivity
  inactivityTimeoutMinutes: 30,
  // Warning before timeout in minutes
  timeoutWarningMinutes: 5,
  // Check interval in milliseconds
  checkIntervalMs: 60000, // 1 minute
};

// Role-Based Access Control (RBAC) configuration
export const RBAC_CONFIG = {
  // Available roles in the system
  roles: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer',
  },
  // Role hierarchy (higher index = more permissions)
  roleHierarchy: ['viewer', 'editor', 'admin', 'super_admin'],
  // Default role for new admins
  defaultRole: 'admin',
  // Routes and their required roles
  routePermissions: {
    // Admin management routes require super_admin
    '/admin/users': ['super_admin'],
    '/admin/users/add': ['super_admin'],
    '/admin/settings': ['super_admin', 'admin'],
    // Content management routes
    '/blogs': ['super_admin', 'admin', 'editor'],
    '/blogs/add': ['super_admin', 'admin', 'editor'],
    '/notes': ['super_admin', 'admin', 'editor'],
    // Default routes accessible to all authenticated users
    default: ['super_admin', 'admin', 'editor', 'viewer'],
  },
};

// API endpoints configuration

export const API_ENDPOINTS = {
  // Use relative path ONLY in DEV mode AND on localhost to use Vite proxy
  // Otherwise use absolute URL (Production or Dev on remote host)
  baseUrl: (import.meta.env.DEV && typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? ''
    : (import.meta.env.VITE_API_BASE_URL || 'https://api.entrancegateway.com'),
  auth: {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh-token',
    register: '/api/v1/auth/admin/register',
    validateToken: '/api/v1/auth/validate',
  },
};

// Security headers to validate in responses
export const SECURITY_HEADERS = {
  // Headers the backend should include
  expected: [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Strict-Transport-Security',
  ],
};

// Common weak passwords to reject (subset - full list should be larger)
export const COMMON_PASSWORDS = [
  'password123456',
  'admin12345678',
  '123456789012',
  'qwerty12345678',
  'letmein123456',
  'welcome12345',
  'monkey12345678',
  'dragon12345678',
  'master12345678',
  'administrator1',
];

// XSS patterns to detect and block
export const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:\s*text\/html/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<link/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
];

// SQL injection patterns to detect
export const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/gi,
  /(--|;|\/\*|\*\/)/g,
  /(\bOR\b|\bAND\b)\s*\d+\s*=\s*\d+/gi,
  /'\s*(OR|AND)\s*'.*?'/gi,
];

export default {
  PASSWORD_REQUIREMENTS,
  TOKEN_CONFIG,
  RATE_LIMIT_CONFIG,
  SESSION_CONFIG,
  RBAC_CONFIG,
  API_ENDPOINTS,
  SECURITY_HEADERS,
  COMMON_PASSWORDS,
  XSS_PATTERNS,
  SQL_INJECTION_PATTERNS,
};
