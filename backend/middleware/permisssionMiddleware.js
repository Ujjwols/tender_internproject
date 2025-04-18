const AppError = require('../utils/appError');

const checkPermission = (permission) => {
  return (req, res, next) => {
    // Check if user exists and has permissions array
    console.log('Checking permission:', permission, 'for user:', req.user._id);
    if (!req.user || !Array.isArray(req.user.permissions)) {
      return next(new AppError('Authentication error: User data incomplete', 401));
    }

    // Check if user has the required permission
    if (!req.user.permissions.includes(permission)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

// Function to check for any of multiple permissions
const checkAnyPermission = (permissions) => {
  return (req, res, next) => {
    // Check if user exists and has permissions array
    if (!req.user || !Array.isArray(req.user.permissions)) {
      return next(new AppError('Authentication error: User data incomplete', 401));
    }

    // Check if user has at least one of the required permissions
    const hasPermission = permissions.some((perm) =>
      req.user.permissions.includes(perm)
    );

    if (!hasPermission) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

module.exports = {
  checkPermission,
  checkAnyPermission,
};