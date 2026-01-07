import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import STATUSES from "../../globals/status/statuses";
import Form from "./form/login";
import { 
  login, 
  setStatus,
  selectAuthStatus,
  selectAuthError,
  selectIsAuthenticated,
  selectLockoutStatus,
} from "../../../store/authSlice";
import tokenService from "../../auth/services/tokenService";

/**
 * Admin Login Page
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const hasCheckedAuth = useRef(false);
  
  // Redux selectors
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const lockoutStatus = useSelector(selectLockoutStatus);

  // Get redirect location from state
  const from = location.state?.from?.pathname || "/";
  const sessionError = location.state?.error;

  /**
   * Handle login submission
   */
  const handleLogin = async (data) => {
    try {
      await dispatch(login(data));
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  /**
   * Redirect on successful authentication
   */
  useEffect(() => {
    if (status === STATUSES.SUCCESS && isAuthenticated) {
      dispatch(setStatus(null));
      navigate(from, { replace: true });
    }
  }, [status, isAuthenticated, navigate, dispatch, from]);

  /**
   * Check if already authenticated on mount (only once)
   */
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    
    // Check authentication using the same service as ProtectedRoute
    // This prevents potential loops if one storage method fails while the other exists
    if (tokenService.isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const displayError = error || sessionError;

  return (
    <Form 
      type="Login" 
      onSubmit={handleLogin}
      error={status === STATUSES.ERROR ? displayError : sessionError}
      lockoutStatus={lockoutStatus}
      isLoading={status === STATUSES.LOADING}
    />
  );
};

export default Login;
