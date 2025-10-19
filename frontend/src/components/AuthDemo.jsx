import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { performLogout, isAuthenticated, hasRole, getUserRole } from '../utils/authUtils';
import { setUserData } from '../redux/userSlice';

/**
 * AuthDemo Component - Demonstrates authentication features
 * This component shows the current authentication state and available actions
 */
const AuthDemo = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    performLogout(dispatch, navigate, setUserData);
  };

  const testProtectedRoute = () => {
    // Try to navigate to a protected route
    navigate('/profile');
  };

  const testRoleBasedRoute = () => {
    // Try to navigate to educator-only route
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Authentication Demo</h2>
      
      {/* Authentication Status */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Authentication Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAuthenticated(userData) 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isAuthenticated(userData) ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2">Role:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getUserRole(userData) || 'No Role'}
            </span>
          </div>
        </div>
      </div>

      {/* User Information */}
      {userData && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-600">Name:</span>
              <span className="ml-2">{userData.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2">{userData.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Role:</span>
              <span className="ml-2 capitalize">{userData.role}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">User ID:</span>
              <span className="ml-2 font-mono text-sm">{userData._id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Role-Based Features */}
      <div className="mb-8 p-4 bg-purple-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Role-Based Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2">Educator Access:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hasRole(userData, 'educator') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {hasRole(userData, 'educator') ? 'Granted' : 'Denied'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 mr-2">Student Access:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hasRole(userData, 'student') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {hasRole(userData, 'student') ? 'Granted' : 'Denied'}
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar Visibility */}
      <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Sidebar Visibility</h3>
        <div className="flex items-center">
          <span className="font-medium text-gray-600 mr-2">Sidebar Display:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isAuthenticated(userData) 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated(userData) ? 'Visible' : 'Hidden'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          The sidebar is automatically shown/hidden based on authentication status.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Test Actions</h3>
        
        <div className="flex flex-wrap gap-3">
          {!isAuthenticated(userData) ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Signup
              </button>
            </>
          ) : (
            <>
              <button
                onClick={testProtectedRoute}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Test Protected Route (Profile)
              </button>
              
              <button
                onClick={testRoleBasedRoute}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Test Role-Based Route (Dashboard)
              </button>
              
              <button
                onClick={() => navigate('/mcq-of-the-day')}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Test MCQ Feature
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Authentication Flow</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>User visits protected route → Redirected to login if not authenticated</li>
          <li>User logs in → Token stored in HTTP-only cookie + User data in Redux</li>
          <li>Sidebar becomes visible upon successful authentication</li>
          <li>Role-based routes are protected (e.g., only educators can access dashboard)</li>
          <li>User logs out → Token cleared + Redirected to login + Sidebar hidden</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthDemo;