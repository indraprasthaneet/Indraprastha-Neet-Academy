import axios from 'axios';
import { toast } from 'react-toastify';

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

/**
 * Logout utility function that clears authentication and redirects
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} navigate - React Router navigate function
 * @param {Function} setUserData - Redux action to clear user data
 */
export const performLogout = async (dispatch, navigate, setUserData) => {
  try {
    // Call backend logout endpoint to clear cookies
    await axios.get(`${serverUrl}/api/auth/logout`, {
      withCredentials: true
    });

    // Clear user data from Redux store
    dispatch(setUserData(null));

    // Clear any localStorage items if used
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to login page
    navigate('/login', { replace: true });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if backend call fails, clear frontend state
    dispatch(setUserData(null));
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    
    toast.warning('Logged out (with some issues)');
    navigate('/login', { replace: true });
  }
};

/**
 * Check if user is authenticated
 * @param {Object} userData - User data from Redux store
 * @returns {boolean} - Whether user is authenticated
 */
export const isAuthenticated = (userData) => {
  return userData && userData._id;
};

/**
 * Check if user has specific role
 * @param {Object} userData - User data from Redux store
 * @param {string} role - Role to check ('educator', 'student')
 * @returns {boolean} - Whether user has the specified role
 */
export const hasRole = (userData, role) => {
  return userData && userData.role === role;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} userData - User data from Redux store
 * @param {Array} roles - Array of roles to check
 * @returns {boolean} - Whether user has any of the specified roles
 */
export const hasAnyRole = (userData, roles) => {
  return userData && roles.includes(userData.role);
};

/**
 * Get user role or return null
 * @param {Object} userData - User data from Redux store
 * @returns {string|null} - User role or null
 */
export const getUserRole = (userData) => {
  return userData?.role || null;
};
