import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { performLogout } from '@/store/authSlice';

/**
 * Secure Logout Button Component
 * SECURITY: Ensures complete token cleanup and server-side invalidation
 * 
 * @param {Object} props
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showIcon - Show logout icon
 * @param {string} props.label - Button label
 */
const LogoutButton = ({
  className = '',
  showIcon = true,
  label = 'Logout',
  variant = 'default', // 'default', 'minimal', 'danger'
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      // Dispatch logout action (handles token cleanup)
      await dispatch(performLogout());

      // Navigate to login page
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if server logout fails
      navigate('/admin/login', { replace: true });
    }
  }, [dispatch, navigate]);

  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
    minimal: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
        font-medium transition-all duration-200 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-gray-500
        ${variantStyles[variant]}
        ${className}
      `}
      aria-label="Logout"
    >
      {showIcon && <LogOut className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
};

export default LogoutButton;
