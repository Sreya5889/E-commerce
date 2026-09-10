import { AppError } from './errorHandler.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required before role check.', 401, 'UNAUTHORIZED'));
    }

    const userRoles = req.user.roles || [];
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      return next(
        new AppError(
          `Access forbidden. Requires one of the following roles: ${allowedRoles.join(', ')}`,
          403,
          'FORBIDDEN'
        )
      );
    }

    next();
  };
};

export const requireAdmin = requireRole('admin');
export const requireTeacher = requireRole('teacher', 'admin');
export const requireSupport = requireRole('support', 'admin');
