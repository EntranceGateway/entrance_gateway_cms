/**
 * Rate Limit Service
 * Client-side rate limiting to prevent brute force attacks.
 * SECURITY: Works in conjunction with server-side rate limiting for defense in depth.
 */

import { RATE_LIMIT_CONFIG } from '../config/securityConfig';

// In-memory rate limit state
let rateLimitState = {
  attempts: 0,
  lastAttemptTime: null,
  lockoutUntil: null,
  consecutiveFailures: 0,
};

/**
 * Initialize rate limit state from localStorage
 * SECURITY: Persists across page refreshes to prevent bypass
 */
function initializeState() {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_CONFIG.storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      rateLimitState = {
        attempts: parsed.a || 0,
        lastAttemptTime: parsed.t || null,
        lockoutUntil: parsed.l || null,
        consecutiveFailures: parsed.f || 0,
      };

      // Clear old lockouts (over 24 hours)
      if (rateLimitState.lockoutUntil && Date.now() - rateLimitState.lockoutUntil > 24 * 60 * 60 * 1000) {
        resetRateLimit();
      }
    }
  } catch (error) {
    console.error('Failed to initialize rate limit state:', error);
    resetRateLimit();
  }
}

/**
 * Persist rate limit state to localStorage
 */
function persistState() {
  try {
    localStorage.setItem(RATE_LIMIT_CONFIG.storageKey, JSON.stringify({
      a: rateLimitState.attempts,
      t: rateLimitState.lastAttemptTime,
      l: rateLimitState.lockoutUntil,
      f: rateLimitState.consecutiveFailures,
    }));
  } catch (error) {
    console.error('Failed to persist rate limit state:', error);
  }
}

/**
 * Check if currently locked out
 * SECURITY: Prevents login attempts during lockout period
 * @returns {Object} Lockout status
 */
export function checkLockout() {
  initializeState();

  const now = Date.now();

  // Check if lockout has expired
  if (rateLimitState.lockoutUntil && now >= rateLimitState.lockoutUntil) {
    // Lockout expired, but keep consecutive failures for progressive lockout
    rateLimitState.lockoutUntil = null;
    rateLimitState.attempts = 0;
    persistState();
  }

  const isLockedOut = rateLimitState.lockoutUntil && now < rateLimitState.lockoutUntil;
  const remainingTime = isLockedOut 
    ? Math.ceil((rateLimitState.lockoutUntil - now) / 1000) 
    : 0;

  return {
    isLockedOut,
    remainingSeconds: remainingTime,
    remainingMinutes: Math.ceil(remainingTime / 60),
    lockoutUntil: rateLimitState.lockoutUntil 
      ? new Date(rateLimitState.lockoutUntil).toISOString() 
      : null,
    attempts: rateLimitState.attempts,
    maxAttempts: RATE_LIMIT_CONFIG.maxLoginAttempts,
    attemptsRemaining: Math.max(0, RATE_LIMIT_CONFIG.maxLoginAttempts - rateLimitState.attempts),
  };
}

/**
 * Record a failed login attempt
 * SECURITY: Implements exponential backoff and lockout
 * @param {string} serverLockoutUntil - Optional server-provided lockout time
 * @returns {Object} Updated lockout status
 */
export function recordFailedAttempt(serverLockoutUntil = null) {
  initializeState();

  const now = Date.now();
  rateLimitState.attempts += 1;
  rateLimitState.consecutiveFailures += 1;
  rateLimitState.lastAttemptTime = now;

  // Use server lockout if provided (server is authoritative)
  if (serverLockoutUntil) {
    rateLimitState.lockoutUntil = new Date(serverLockoutUntil).getTime();
  } else if (rateLimitState.attempts >= RATE_LIMIT_CONFIG.maxLoginAttempts) {
    // Calculate progressive lockout duration
    // SECURITY: Exponential backoff makes brute force increasingly impractical
    const baseLockout = RATE_LIMIT_CONFIG.lockoutDurationMinutes * 60 * 1000;
    const multiplier = Math.pow(
      RATE_LIMIT_CONFIG.delayMultiplier, 
      Math.floor(rateLimitState.consecutiveFailures / RATE_LIMIT_CONFIG.maxLoginAttempts) - 1
    );
    const lockoutDuration = Math.min(baseLockout * multiplier, 24 * 60 * 60 * 1000); // Max 24 hours
    
    rateLimitState.lockoutUntil = now + lockoutDuration;
  }

  persistState();
  return checkLockout();
}

/**
 * Record a successful login
 * SECURITY: Resets rate limit state on successful authentication
 */
export function recordSuccessfulLogin() {
  resetRateLimit();
}

/**
 * Reset rate limit state
 */
export function resetRateLimit() {
  rateLimitState = {
    attempts: 0,
    lastAttemptTime: null,
    lockoutUntil: null,
    consecutiveFailures: 0,
  };
  
  try {
    localStorage.removeItem(RATE_LIMIT_CONFIG.storageKey);
  } catch (error) {
    console.error('Failed to clear rate limit state:', error);
  }
}

/**
 * Calculate delay before next attempt is allowed
 * SECURITY: Exponential backoff between attempts
 * @returns {number} Delay in milliseconds
 */
export function getAttemptDelay() {
  initializeState();

  if (rateLimitState.attempts === 0) return 0;

  // Exponential backoff
  const delay = RATE_LIMIT_CONFIG.initialDelaySeconds * 1000 * 
    Math.pow(RATE_LIMIT_CONFIG.delayMultiplier, rateLimitState.attempts - 1);
  
  // Max delay of 30 seconds between attempts
  return Math.min(delay, 30000);
}

/**
 * Check if an attempt can be made now
 * @returns {Object} Attempt status
 */
export function canAttemptLogin() {
  const lockoutStatus = checkLockout();
  
  if (lockoutStatus.isLockedOut) {
    return {
      allowed: false,
      reason: 'locked_out',
      message: `Account locked. Try again in ${lockoutStatus.remainingMinutes} minute(s).`,
      waitTime: lockoutStatus.remainingSeconds,
    };
  }

  const delay = getAttemptDelay();
  const timeSinceLastAttempt = rateLimitState.lastAttemptTime 
    ? Date.now() - rateLimitState.lastAttemptTime 
    : Infinity;

  if (timeSinceLastAttempt < delay) {
    const waitTime = Math.ceil((delay - timeSinceLastAttempt) / 1000);
    return {
      allowed: false,
      reason: 'rate_limited',
      message: `Please wait ${waitTime} second(s) before trying again.`,
      waitTime,
    };
  }

  return {
    allowed: true,
    reason: null,
    message: null,
    waitTime: 0,
    attemptsRemaining: RATE_LIMIT_CONFIG.maxLoginAttempts - rateLimitState.attempts,
  };
}

/**
 * Format lockout message for display
 * @param {Object} lockoutStatus - Status from checkLockout()
 * @returns {string} User-friendly message
 */
export function formatLockoutMessage(lockoutStatus) {
  if (!lockoutStatus.isLockedOut) return null;

  const minutes = lockoutStatus.remainingMinutes;
  const seconds = lockoutStatus.remainingSeconds % 60;

  if (minutes > 1) {
    return `Too many failed attempts. Account locked for ${minutes} minute(s).`;
  } else if (minutes === 1) {
    return `Too many failed attempts. Account locked for 1 minute and ${seconds} seconds.`;
  } else {
    return `Too many failed attempts. Try again in ${seconds} second(s).`;
  }
}

/**
 * Create a countdown timer for lockout
 * @param {Function} onTick - Callback for each second
 * @param {Function} onComplete - Callback when lockout ends
 * @returns {Function} Cancel function
 */
export function createLockoutCountdown(onTick, onComplete) {
  let intervalId = null;

  const tick = () => {
    const status = checkLockout();
    
    if (!status.isLockedOut) {
      if (intervalId) clearInterval(intervalId);
      onComplete?.();
      return;
    }

    onTick?.(status);
  };

  // Initial tick
  tick();

  // Set up interval
  intervalId = setInterval(tick, 1000);

  // Return cancel function
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}

export default {
  checkLockout,
  recordFailedAttempt,
  recordSuccessfulLogin,
  resetRateLimit,
  getAttemptDelay,
  canAttemptLogin,
  formatLockoutMessage,
  createLockoutCountdown,
};
