const { verifyToken, extractToken } = require('../utils/jwt');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user info to req.user if valid
 */
function authenticate(req, res, next) {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      const error = new Error('Access denied. No token provided.');
      error.status = 401;
      throw error;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      const authError = new Error('Invalid token.');
      authError.status = 401;
      return next(authError);
    }
    if (error.name === 'TokenExpiredError') {
      const authError = new Error('Token expired.');
      authError.status = 401;
      return next(authError);
    }
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
function optionalAuth(req, res, next) {
  try {
    const token = extractToken(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // Token invalid, but optional - continue without user
    next();
  }
}

/**
 * Role-based authorization middleware
 * @param {string[]} allowedRoles - Roles allowed to access the route
 */
function authorize(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error('Access denied. Authentication required.');
      error.status = 401;
      return next(error);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      const error = new Error('Access denied. Insufficient permissions.');
      error.status = 403;
      return next(error);
    }

    next();
  };
}

module.exports = { authenticate, optionalAuth, authorize };
