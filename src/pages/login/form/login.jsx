import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, Lock, Mail, AlertTriangle } from "lucide-react";
import PasswordStrengthIndicator from "../../../auth/components/PasswordStrengthIndicator";
import { sanitizeEmail } from "../../../auth/utils/inputSanitizer";
import rateLimitService from "../../../auth/services/rateLimitService";

/**
 * Enhanced Login Form Component
 * SECURITY: Implements input validation, rate limiting feedback, and XSS protection
 * 
 * @param {Object} props
 * @param {string} props.role - User role type
 * @param {string} props.type - Form type (Login/Register)
 * @param {Function} props.onSubmit - Submit handler
 * @param {Object} props.user - User data (for register)
 * @param {string} props.error - Error message
 * @param {Object} props.lockoutStatus - Lockout status from auth
 * @param {boolean} props.isLoading - Loading state
 */
const Form = ({ 
  role = "Admin", 
  type, 
  onSubmit, 
  user, 
  error,
  lockoutStatus: propLockoutStatus,
  isLoading = false,
}) => {
  // Form state
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [lockoutStatus, setLockoutStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password, remember } = data;

  // Initialize lockout status check
  useEffect(() => {
    const status = rateLimitService.checkLockout();
    if (status.isLockedOut) {
      setLockoutStatus(status);
      setCountdown(status.remainingSeconds);
    }
  }, []);

  // Update from prop lockout status
  useEffect(() => {
    if (propLockoutStatus?.isLockedOut) {
      setLockoutStatus(propLockoutStatus);
      setCountdown(propLockoutStatus.remainingSeconds);
    }
  }, [propLockoutStatus]);

  // Countdown timer for lockout
  useEffect(() => {
    if (countdown <= 0) {
      setLockoutStatus(null);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setLockoutStatus(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle input changes with validation
  const handleChange = useCallback((e) => {
    const { name, value, type: inputType, checked } = e.target;
    
    setData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));

    // Clear errors on input change
    setLocalError(null);
    
    // Validate email in real-time
    if (name === "email" && value) {
      const sanitized = sanitizeEmail(value);
      setEmailError(sanitized.valid ? null : sanitized.error);
    }
  }, []);

  // Handle form submission
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLocalError(null);

    // Check lockout status first
    const canAttempt = rateLimitService.canAttemptLogin();
    if (!canAttempt.allowed) {
      setLocalError(canAttempt.message);
      if (canAttempt.reason === 'locked_out') {
        setLockoutStatus(rateLimitService.checkLockout());
        setCountdown(canAttempt.waitTime);
      }
      return;
    }

    // Validate email
    const sanitizedEmail = sanitizeEmail(email);
    if (!sanitizedEmail.valid) {
      setEmailError(sanitizedEmail.error);
      return;
    }

    // Validate password presence
    if (!password || password.length === 0) {
      setLocalError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // SECURITY: Pass sanitized email to prevent injection
      await onSubmit({
        email: sanitizedEmail.value,
        password,
        remember,
      });
    } catch (err) {
      setLocalError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, remember, onSubmit]);

  // Format countdown for display
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${secs}s`;
  };

  const isAdmin = role === "admin";
  const title = isAdmin ? "Admin Portal" : "Admin Login";
  const placeholderEmail = isAdmin ? "admin@example.com" : "admin@example.com";
  const displayError = localError || error;
  const isDisabled = isSubmitting || isLoading || !!lockoutStatus;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-10">
        <div className="text-center">
          <h2 className="text-white text-4xl font-bold mb-4">
            {isAdmin ? "Welcome, Admin!" : "Welcome Back!"}
          </h2>
          <p className="text-blue-100 text-lg">
            Entrance Gateway Content Management System
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="md:w-1/2 flex items-center justify-center p-10 bg-gray-50">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {title}
          </h1>

          {/* Lockout Warning */}
          {lockoutStatus && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 font-medium text-sm">
                    Account Locked for 15 Minutes
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    Too many failed attempts. Unlocking in:
                  </p>
                </div>
                <div className="flex items-center gap-1 text-red-600 font-mono font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{formatCountdown(countdown)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {displayError && !lockoutStatus && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {displayError}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  disabled={isDisabled}
                  autoComplete="email"
                  placeholder={placeholderEmail}
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className={`
                    w-full pl-10 pr-4 py-3 border rounded-lg 
                    focus:outline-none focus:ring-2 transition
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${emailError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500'
                    }
                  `}
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-red-500 text-sm">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  disabled={isDisabled}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`
                    w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isDisabled}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password strength indicator (for registration forms) */}
              {type === "Register" && password && (
                <PasswordStrengthIndicator 
                  password={password} 
                  showRequirements={true}
                />
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={handleChange}
                  disabled={isDisabled}
                  className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <a 
                href="/forgot-password" 
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`
                w-full py-3 rounded-lg font-semibold transition-all
                flex items-center justify-center gap-2
                ${isDisabled 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 text-white'
                }
              `}
            >
              {(isSubmitting || isLoading) ? (
                <>
                  <svg 
                    className="animate-spin h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : lockoutStatus ? (
                <span>Please wait {formatCountdown(countdown)}</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Attempts remaining warning */}
          {!lockoutStatus && propLockoutStatus?.attemptsRemaining !== undefined && 
           propLockoutStatus.attemptsRemaining < 3 && (
            <p className="mt-4 text-center text-sm text-amber-600">
              ⚠️ {propLockoutStatus.attemptsRemaining} attempt(s) remaining before lockout
            </p>
          )}

          <p className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Entrance Gateway. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Form;
