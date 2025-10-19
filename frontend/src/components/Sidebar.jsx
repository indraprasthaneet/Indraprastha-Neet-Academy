import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '../contexts/SidebarContext';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/companylogo.png';
import { 
  FaQuestionCircle, 
  FaVideo, 
  FaClipboardList, 
  FaGraduationCap, 
  FaCalendarDay, 
  FaGem, 
  FaBook,
  FaUser,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';
import { performLogout } from '../utils/authUtils';
import { setUserData } from '../redux/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { isOpen, isCollapsed, isMobile, toggleSidebar, closeSidebar } = useSidebar();
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render sidebar if user is not authenticated
  if (!userData) {
    return null;
  }

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: FaHome,
      path: '/',
      color: 'text-gray-600'
    },
    {
      id: 'question-bank',
      label: 'Question Bank',
      icon: FaQuestionCircle,
      path: '/question-bank',
      color: 'text-blue-500'
    },
    {
      id: 'test-series',
      label: 'Test Series',
      icon: FaClipboardList,
      path: '/test-series',
      color: 'text-green-500'
    },
    {
      id: 'pyq',
      label: 'PYQ',
      icon: FaGraduationCap,
      path: '/pyq-bundles',
      color: 'text-purple-500'
    },
    {
      id: 'mcq-day',
      label: 'MCQ of the Day',
      icon: FaCalendarDay,
      path: '/mcq-of-the-day',
      color: 'text-orange-500'
    },
    {
      id: 'pearl',
      label: 'PEARL',
      icon: FaGem,
      path: '/pearl',
      color: 'text-pink-500'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: FaBook,
      path: '/allcourses',
      color: 'text-indigo-500'
    }
    ,
    {
      id: 'profile',
      label: 'Profile',
      icon: FaUser,
      path: '/profile',
      color: 'text-gray-400'
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: FaTimes,
      path: null,
      color: 'text-red-400'
    }
  ];

  const handleItemClick = async (item) => {
    // Special-case: logout action
    if (item.id === 'logout') {
      await performLogout(dispatch, navigate, setUserData);
      if (isMobile) {
        closeSidebar();
      }
      return;
    }

    let targetPath = item.path;
    
    // Handle role-based routing for Test Series
    if (item.id === 'test-series' && userData) {
      if (userData.role === 'educator') {
        targetPath = '/test-series/create';
      } else {
        targetPath = '/test-series';
      }
    }
    
    navigate(targetPath);
    if (isMobile) {
      closeSidebar();
    }
  };

  const isActiveRoute = (path) => {
    // Special handling for PYQ routes with query parameters
    if (path === '/pyq-bundles') {
      return location.pathname === '/pyq-bundles';
    }
    // Special handling for Test Series routes with query parameters  
    if (path === '/test-series') {
      return location.pathname === '/test-series';
    }
    return location.pathname === path;
  };

  const sidebarVariants = {
    open: {
      width: isMobile ? '280px' : (isCollapsed ? '80px' : '280px'),
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    closed: {
      width: isMobile ? '0px' : '80px',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      visibility: 'visible',
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      visibility: 'hidden',
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            className="fixed inset-0 bg-transparent bg-opacity-50 z-[9998] md:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-0 h-full shadow-lg z-[9999] border-r"
        style={{
        background: 'linear-gradient(180deg, rgba(13,14,22,0.95) 0%, rgba(16,20,36,0.92) 60%, rgba(20,25,44,0.9) 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)', overflow: 'hidden'}}
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b ">
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex items-center space-x-2"
                >
                  <div className="w-20 h-8 rounded-lg flex items-center justify-center">
                    <img src={logo} alt="Company Logo" />
                  </div>
                  <span className="text-xl font-bold text-white">Indraprastha Neet Academy</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-transparent transition-colors duration-200"
            >
              {isMobile && isOpen ? (
                <FaTimes className="w-5 h-5 text-white transition-transform duration-300 hover:-translate-y-1 hover:-translate-x-1" />
              ) : (
                <FaBars className="w-5 h-5 text-white transition-transform duration-300 hover:-translate-x-1" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-transparent text-white'
                      : 'text-white hover:bg-transparent'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'text-blue-600' : item.color
                    } group-hover:scale-110 transition-transform duration-200`}
                  />
                  
                  <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
                      <motion.span
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="font-medium truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="text-xs text-gray-500 text-center"
                >
                  <p>© 2024 LMS Platform</p>
                  <p>Version 1.0.0</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Toggle Button for Mobile when sidebar is closed */}
      <AnimatePresence>
        {isMobile && !isOpen && (
          <motion.button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-[9997] p-3  shadow-lg rounded-lg md:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <FaBars className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;