/**
 * Protected Route Component
 * SECURITY: Checks authentication using secure encrypted storage
 */

import { Navigate, Outlet } from "react-router-dom";
import tokenService from "../auth/services/tokenService";

const ProtectedRoute = () => {
  // Check authentication using tokenService
  // This automatically handles decrypting the 'eg_at' secure token
  const isAuth = tokenService.isAuthenticated();
  
  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated, render protected content
  return <Outlet />;
};

export default ProtectedRoute;
