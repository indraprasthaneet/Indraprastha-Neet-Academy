import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute Component - Simple route protection with redirect
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {boolean} props.isLoggedIn - Whether the user is logged in (optional, will use userData if not provided)
 * @param {string} props.redirectTo - Where to redirect if not authenticated (default: "/login")
 * @param {Array} props.allowedRoles - Array of roles allowed to access this route
 */
const ProtectedRoute = ({ 
  children, 
  isLoggedIn,
  redirectTo = "/login",
  allowedRoles = []
}) => {
  const { userData, initializing } = useSelector((state) => state.user);
  const location = useLocation();

  // Use provided isLoggedIn or fallback to userData check
  const authenticated = isLoggedIn !== undefined ? isLoggedIn : !!userData;

  // While we're initializing (checking session on page load), don't redirect yet.
  // This prevents a flash of unauthenticated redirect while the app rehydrates the user.
  if (initializing) {
    // You can render a loader here if you want a better UX
    return null;
  }

  // If not authenticated (and initialization is done), redirect to login with return URL
  if (!authenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && userData && !allowedRoles.includes(userData.role)) {
    // Redirect to appropriate page based on user role
    const defaultRedirect = userData.role === 'educator' ? '/dashboard' : '/';
    return <Navigate to={defaultRedirect} replace />;
  }

  // Render children if authenticated and authorized
  return children;
};

export default ProtectedRoute;
