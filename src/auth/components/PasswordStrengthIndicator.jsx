import React, { useMemo } from 'react';
import { validatePassword, getStrengthColor, calculateEntropy } from '../utils/passwordValidator';
import { Check, X } from 'lucide-react';

/**
 * Password Strength Indicator Component
 * SECURITY: Visual feedback helps users create strong passwords
 * 
 * @param {Object} props
 * @param {string} props.password - Current password value
 * @param {boolean} props.showRequirements - Show requirement checklist
 * @param {boolean} props.showEntropy - Show entropy score
 */
const PasswordStrengthIndicator = ({ 
  password = '', 
  showRequirements = true,
  showEntropy = false,
}) => {
  // Validate password and get strength
  const validation = useMemo(() => validatePassword(password), [password]);
  const colors = useMemo(() => getStrengthColor(validation.strength), [validation.strength]);
  const entropy = useMemo(() => calculateEntropy(password), [password]);

  // Don't show anything if no password
  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Password Strength</span>
          <span className={`font-medium capitalize ${colors.text}`}>
            {validation.strength}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colors.bar}`}
            style={{ width: `${validation.score}%` }}
          />
        </div>
      </div>

      {/* Entropy display (optional) */}
      {showEntropy && (
        <div className="text-xs text-gray-500">
          Entropy: {entropy} bits 
          {entropy >= 60 && <span className="text-green-600 ml-1">(Strong)</span>}
          {entropy >= 40 && entropy < 60 && <span className="text-yellow-600 ml-1">(Moderate)</span>}
          {entropy < 40 && <span className="text-red-600 ml-1">(Weak)</span>}
        </div>
      )}

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
          <ul className="space-y-1">
            {validation.checks.map((check) => (
              <li 
                key={check.id}
                className={`flex items-center text-xs ${
                  check.passed ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {check.passed ? (
                  <Check className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-red-400" />
                )}
                <span className={check.passed ? 'line-through opacity-70' : ''}>
                  {check.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
