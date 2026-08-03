const { logError } = require('../utils/errorLogger');

// Centralized error handling middleware
// Catches all errors from controllers and returns consistent JSON response
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log error using error logger
  logError(err, req);

  // Don't expose internal errors in production
  const response = {
    error: process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal Server Error'
      : message
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = errorHandler;
