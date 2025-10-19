import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

// Custom hook to use the sidebar context
const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Sidebar provider component
const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, sidebar should be closed by default
      if (window.innerWidth < 768) {
        setIsOpen(false);
        setIsCollapsed(false);
      } else {
        // On desktop, sidebar should be open by default
        setIsOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      if (isOpen) {
        setIsCollapsed(!isCollapsed);
      } else {
        setIsOpen(true);
        setIsCollapsed(false);
      }
    }
  };

  const closeSidebar = () => {
    // Close sidebar regardless of device. Reset collapse state.
    setIsOpen(false);
    setIsCollapsed(false);
  };

  const value = {
    isOpen,
    isCollapsed,
    isMobile,
    toggleSidebar,
    closeSidebar,
    setIsOpen,
    setIsCollapsed
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// Export everything at the bottom to satisfy fast refresh
export { useSidebar, SidebarProvider };