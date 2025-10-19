import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * AuthGuard Component - Protects routes and redirects unauthenticated users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: "/login")
 * @param {Array} props.allowedRoles - Array of roles allowed to access this route
 * @param {boolean} props.showLoading - Whether to show loading state while checking auth
 */
const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login",
  allowedRoles = [],
  showLoading = true 
}) => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If authentication is not required, always render children
    if (!requireAuth) {
      return;
    }

    // If user data is null/undefined and auth is required, redirect to login
    if (!userData) {
      // Save the attempted location for redirect after login
      const from = location.pathname !== '/login' ? location.pathname : '/';
      navigate(redirectTo, { 
        replace: true, 
        state: { from } 
      });
      return;
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(userData.role)) {
      // Redirect to appropriate page based on user role
      const defaultRedirect = userData.role === 'educator' ? '/dashboard' : '/';
      navigate(defaultRedirect, { replace: true });
      return;
    }
  }, [userData, requireAuth, allowedRoles, navigate, redirectTo, location.pathname]);

  // Don't render anything if auth is required but user is not authenticated
  if (requireAuth && !userData) {
    return showLoading ? (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    ) : null;
  }

  // Don't render if role check fails
  if (allowedRoles.length > 0 && userData && !allowedRoles.includes(userData.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return children;
};

export default AuthGuard;