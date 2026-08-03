// Centralized error handling middleware
// Catches all errors from controllers and returns consistent JSON response
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${status}: ${message}`);

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
