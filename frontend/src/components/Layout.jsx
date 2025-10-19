import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  
  // Only show sidebar if user is authenticated
  const showSidebar = !!userData;

  return (
    <div className="relative min-h-screen">
      {/* Sidebar - only render when user is logged in */}
      {showSidebar && <Sidebar />}
      
      {/* Main content - no margin adjustments, preserves existing layouts */}
      <div className="min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;