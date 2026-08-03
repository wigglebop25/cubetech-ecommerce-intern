const { verifyCustomerToken } = require('../utils/customerJwt');

/**
 * Customer authentication middleware
 * Verifies customer JWT token from Authorization header
 * Attaches customer info to req.customer if valid
 */
function customerAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      const error = new Error('Access denied. No token provided.');
      error.status = 401;
      throw error;
    }

    const decoded = verifyCustomerToken(token);
    req.customer = decoded;
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

module.exports = { customerAuth };
