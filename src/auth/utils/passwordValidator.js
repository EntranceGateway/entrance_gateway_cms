/**
 * Password Validator Utility
 * Implements OWASP password strength requirements.
 * SECURITY: Validates password strength before submission to prevent weak passwords.
 */

import { PASSWORD_REQUIREMENTS, COMMON_PASSWORDS } from '../config/securityConfig';

/**
 * Individual validation checks for password requirements
 */
const validators = {
  /**
   * Check minimum length requirement
   * SECURITY: Minimum 12 characters prevents brute force attacks
   */
  minLength: (password) => ({
    passed: password.length >= PASSWORD_REQUIREMENTS.minLength,
    message: `At least ${PASSWORD_REQUIREMENTS.minLength} characters`,
    id: 'minLength',
  }),

  /**
   * Check maximum length requirement
   * SECURITY: Prevents DoS through extremely long passwords
   */
  maxLength: (password) => ({
    passed: password.length <= PASSWORD_REQUIREMENTS.maxLength,
    message: `Maximum ${PASSWORD_REQUIREMENTS.maxLength} characters`,
    id: 'maxLength',
  }),

  /**
   * Check for uppercase letters
   * SECURITY: Increases character set complexity
   */
  uppercase: (password) => ({
    passed: PASSWORD_REQUIREMENTS.requireUppercase ? /[A-Z]/.test(password) : true,
    message: 'At least one uppercase letter (A-Z)',
    id: 'uppercase',
  }),

  /**
   * Check for lowercase letters
   * SECURITY: Increases character set complexity
   */
  lowercase: (password) => ({
    passed: PASSWORD_REQUIREMENTS.requireLowercase ? /[a-z]/.test(password) : true,
    message: 'At least one lowercase letter (a-z)',
    id: 'lowercase',
  }),

  /**
   * Check for numbers
   * SECURITY: Increases character set complexity
   */
  numbers: (password) => ({
    passed: PASSWORD_REQUIREMENTS.requireNumbers ? /[0-9]/.test(password) : true,
    message: 'At least one number (0-9)',
    id: 'numbers',
  }),

  /**
   * Check for special characters
   * SECURITY: Significantly increases entropy
   */
  specialChars: (password) => {
    if (!PASSWORD_REQUIREMENTS.requireSpecialChars) {
      return { passed: true, message: 'Special character (optional)', id: 'specialChars' };
    }
    // Escape special regex characters and create pattern
    const escapedChars = PASSWORD_REQUIREMENTS.specialCharacters.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`[${escapedChars}]`);
    return {
      passed: pattern.test(password),
      message: `At least one special character (${PASSWORD_REQUIREMENTS.specialCharacters})`,
      id: 'specialChars',
    };
  },

  /**
   * Check against common password list
   * SECURITY: Prevents use of commonly compromised passwords
   */
  notCommon: (password) => {
    const lowerPassword = password.toLowerCase();
    const isCommon = COMMON_PASSWORDS.some(
      (common) => lowerPassword === common || lowerPassword.includes(common)
    );
    return {
      passed: !isCommon,
      message: 'Not a commonly used password',
      id: 'notCommon',
    };
  },

  /**
   * Check for sequential characters
   * SECURITY: Prevents easily guessable patterns
   */
  noSequential: (password) => {
    const sequences = ['123456', 'abcdef', 'qwerty', '654321', 'fedcba'];
    const lowerPassword = password.toLowerCase();
    const hasSequence = sequences.some((seq) => lowerPassword.includes(seq));
    return {
      passed: !hasSequence,
      message: 'No sequential characters (123456, abcdef, etc.)',
      id: 'noSequential',
    };
  },

  /**
   * Check for repeated characters
   * SECURITY: Prevents patterns like 'aaaaaa' or '111111'
   */
  noRepeating: (password) => {
    const hasRepeating = /(.)\1{3,}/.test(password);
    return {
      passed: !hasRepeating,
      message: 'No more than 3 repeated characters',
      id: 'noRepeating',
    };
  },
};

/**
 * Validate password against all requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with details
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      score: 0,
      strength: 'none',
      checks: [],
      errors: ['Password is required'],
    };
  }

  // Run all validators
  const checks = Object.values(validators).map((validator) => validator(password));
  
  // Calculate results
  const passedChecks = checks.filter((check) => check.passed);
  const failedChecks = checks.filter((check) => !check.passed);
  const score = Math.round((passedChecks.length / checks.length) * 100);

  // Determine strength level
  let strength;
  if (score < 40) {
    strength = 'weak';
  } else if (score < 60) {
    strength = 'fair';
  } else if (score < 80) {
    strength = 'good';
  } else if (score < 100) {
    strength = 'strong';
  } else {
    strength = 'excellent';
  }

  return {
    isValid: failedChecks.length === 0,
    score,
    strength,
    checks,
    errors: failedChecks.map((check) => check.message),
    passed: passedChecks.map((check) => check.message),
  };
}

/**
 * Calculate password entropy (bits of randomness)
 * SECURITY: Higher entropy = stronger password
 * @param {string} password - Password to analyze
 * @returns {number} Entropy in bits
 */
export function calculateEntropy(password) {
  if (!password) return 0;

  let charSetSize = 0;
  
  if (/[a-z]/.test(password)) charSetSize += 26;
  if (/[A-Z]/.test(password)) charSetSize += 26;
  if (/[0-9]/.test(password)) charSetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charSetSize += 32;

  // Entropy = log2(charSetSize^length) = length * log2(charSetSize)
  return Math.round(password.length * Math.log2(charSetSize));
}

/**
 * Get strength color for UI display
 * @param {string} strength - Strength level
 * @returns {Object} Color configuration
 */
export function getStrengthColor(strength) {
  const colors = {
    none: { bg: 'bg-gray-200', text: 'text-gray-500', bar: 'bg-gray-300' },
    weak: { bg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-500' },
    fair: { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-500' },
    good: { bg: 'bg-yellow-100', text: 'text-yellow-600', bar: 'bg-yellow-500' },
    strong: { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-500' },
    excellent: { bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  };
  return colors[strength] || colors.none;
}

/**
 * Quick validation check (for real-time feedback)
 * @param {string} password - Password to check
 * @returns {boolean} Whether password meets minimum requirements
 */
export function isPasswordValid(password) {
  return validatePassword(password).isValid;
}

export default {
  validatePassword,
  calculateEntropy,
  getStrengthColor,
  isPasswordValid,
};
