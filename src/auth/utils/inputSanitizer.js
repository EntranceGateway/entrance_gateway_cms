/**
 * Input Sanitizer Utility
 * Provides XSS and injection attack protection.
 * SECURITY: All user inputs should be sanitized before processing.
 */

import { XSS_PATTERNS, SQL_INJECTION_PATTERNS } from '../config/securityConfig';

/**
 * HTML entity encoding map
 * SECURITY: Prevents XSS by encoding dangerous characters
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Encode HTML entities to prevent XSS
 * SECURITY: Core XSS prevention - encodes special HTML characters
 * @param {string} input - String to encode
 * @returns {string} Encoded string
 */
export function encodeHtmlEntities(input) {
  if (!input || typeof input !== 'string') return input;
  
  return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Decode HTML entities (use carefully - only for display)
 * @param {string} input - Encoded string
 * @returns {string} Decoded string
 */
export function decodeHtmlEntities(input) {
  if (!input || typeof input !== 'string') return input;

  const textarea = document.createElement('textarea');
  textarea.innerHTML = input;
  return textarea.value;
}

/**
 * Strip all HTML tags from input
 * SECURITY: Removes potential script injection vectors
 * @param {string} input - String to sanitize
 * @returns {string} String without HTML tags
 */
export function stripHtmlTags(input) {
  if (!input || typeof input !== 'string') return input;

  // Remove HTML tags while preserving text content
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Check for XSS patterns in input
 * SECURITY: Detects common XSS attack patterns
 * @param {string} input - String to check
 * @returns {Object} Detection result
 */
export function detectXss(input) {
  if (!input || typeof input !== 'string') {
    return { detected: false, patterns: [] };
  }

  const detectedPatterns = [];
  
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      detectedPatterns.push(pattern.toString());
      // Reset regex lastIndex for global patterns
      pattern.lastIndex = 0;
    }
  }

  return {
    detected: detectedPatterns.length > 0,
    patterns: detectedPatterns,
    message: detectedPatterns.length > 0 
      ? 'Potentially malicious content detected' 
      : null,
  };
}

/**
 * Check for SQL injection patterns in input
 * SECURITY: Detects common SQL injection patterns
 * Note: Backend should use parameterized queries - this is defense in depth
 * @param {string} input - String to check
 * @returns {Object} Detection result
 */
export function detectSqlInjection(input) {
  if (!input || typeof input !== 'string') {
    return { detected: false, patterns: [] };
  }

  const detectedPatterns = [];
  
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      detectedPatterns.push(pattern.toString());
      pattern.lastIndex = 0;
    }
  }

  return {
    detected: detectedPatterns.length > 0,
    patterns: detectedPatterns,
    message: detectedPatterns.length > 0 
      ? 'Potentially malicious query detected' 
      : null,
  };
}

/**
 * Sanitize string input for safe processing
 * SECURITY: Main sanitization function - combines multiple protections
 * @param {string} input - Input to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} Sanitized input with metadata
 */
export function sanitizeInput(input, options = {}) {
  const { 
    allowHtml = false, 
    trimWhitespace = true,
    checkXss = true,
    checkSqlInjection = true,
    maxLength = 10000,
  } = options;

  // Handle non-string inputs
  if (input === null || input === undefined) {
    return { value: '', sanitized: false, warnings: [] };
  }

  if (typeof input !== 'string') {
    return { 
      value: String(input), 
      sanitized: true, 
      warnings: ['Input was converted to string'] 
    };
  }

  const warnings = [];
  let sanitized = input;
  let wasSanitized = false;

  // Trim whitespace
  if (trimWhitespace) {
    const trimmed = sanitized.trim();
    if (trimmed !== sanitized) {
      wasSanitized = true;
      sanitized = trimmed;
    }
  }

  // Normalize whitespace (collapse multiple spaces)
  const normalized = sanitized.replace(/\s+/g, ' ');
  if (normalized !== sanitized) {
    wasSanitized = true;
    sanitized = normalized;
  }

  // Check for XSS
  if (checkXss) {
    const xssResult = detectXss(sanitized);
    if (xssResult.detected) {
      warnings.push('XSS pattern detected and removed');
      wasSanitized = true;
      // Remove detected patterns
      for (const pattern of XSS_PATTERNS) {
        sanitized = sanitized.replace(pattern, '');
        pattern.lastIndex = 0;
      }
    }
  }

  // Check for SQL injection
  if (checkSqlInjection) {
    const sqlResult = detectSqlInjection(sanitized);
    if (sqlResult.detected) {
      warnings.push('SQL injection pattern detected');
      // Don't remove - just warn. Backend should handle with parameterized queries
    }
  }

  // Strip HTML if not allowed
  if (!allowHtml) {
    const stripped = stripHtmlTags(sanitized);
    if (stripped !== sanitized) {
      wasSanitized = true;
      sanitized = stripped;
    }
  }

  // Encode remaining special characters (defense in depth)
  sanitized = encodeHtmlEntities(sanitized);
  
  // Enforce max length
  if (sanitized.length > maxLength) {
    wasSanitized = true;
    sanitized = sanitized.substring(0, maxLength);
    warnings.push(`Input truncated to ${maxLength} characters`);
  }

  return {
    value: sanitized,
    original: input,
    sanitized: wasSanitized,
    warnings,
  };
}

/**
 * Sanitize email specifically
 * SECURITY: Validates and sanitizes email format
 * @param {string} email - Email to sanitize
 * @returns {Object} Sanitized email with validation
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return { value: '', valid: false, error: 'Email is required' };
  }

  // Basic sanitization
  let sanitized = email.trim().toLowerCase();

  // Remove any HTML/script content
  sanitized = stripHtmlTags(sanitized);

  // Basic email validation pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailPattern.test(sanitized);

  // Check for suspicious patterns
  const suspicious = 
    sanitized.includes('<') || 
    sanitized.includes('>') || 
    sanitized.includes('"') ||
    sanitized.includes("'");

  return {
    value: isValid ? sanitized : '',
    valid: isValid && !suspicious,
    error: !isValid ? 'Invalid email format' : suspicious ? 'Invalid characters in email' : null,
  };
}

/**
 * Sanitize object recursively
 * SECURITY: Sanitizes all string values in an object
 * @param {Object} obj - Object to sanitize
 * @param {Object} options - Sanitization options
 * @returns {Object} Sanitized object
 */
export function sanitizeObject(obj, options = {}) {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = Array.isArray(obj) ? [] : {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, options).value;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, options);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create a safe display string (for innerHTML or similar)
 * SECURITY: Use this when content needs to be displayed as HTML
 * @param {string} input - Input to make safe
 * @returns {string} Safe display string
 */
export function createSafeDisplayString(input) {
  if (!input || typeof input !== 'string') return '';
  
  return encodeHtmlEntities(stripHtmlTags(input));
}

export default {
  encodeHtmlEntities,
  decodeHtmlEntities,
  stripHtmlTags,
  detectXss,
  detectSqlInjection,
  sanitizeInput,
  sanitizeEmail,
  sanitizeObject,
  createSafeDisplayString,
};
