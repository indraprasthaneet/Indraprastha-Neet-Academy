const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated and has a role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in to continue.'
      });
    }

    // Check if user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to perform this action.'
      });
    }

    next();
  };
};

export default authorizeRoles;