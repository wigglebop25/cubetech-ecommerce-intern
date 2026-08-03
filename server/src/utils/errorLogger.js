// Error logging utility
// Centralized error tracking and logging

const fs = require('fs');
const path = require('path');

// Log file path
const LOG_DIR = path.join(__dirname, '../../logs');
const ERROR_LOG_FILE = path.join(LOG_DIR, 'errors.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Log error to file and console
 * @param {Error} error - Error object
 * @param {Object} req - Express request object (optional)
 */
function logError(error, req = null) {
  const timestamp = new Date().toISOString();
  const errorEntry = {
    timestamp,
    message: error.message,
    stack: error.stack,
    status: error.status || 500,
    path: req ? `${req.method} ${req.url}` : 'N/A',
    ip: req ? req.ip : 'N/A'
  };

  // Log to console
  console.error('\x1b[31m[ERROR]\x1b[0m', timestamp, error.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  // Log to file
  const logLine = JSON.stringify(errorEntry) + '\n';
  fs.appendFile(ERROR_LOG_FILE, logLine, (err) => {
    if (err) {
      console.error('Failed to write to error log:', err);
    }
  });
}

/**
 * Get recent errors from log file
 * @param {number} limit - Number of errors to return
 * @returns {Array} Recent errors
 */
function getRecentErrors(limit = 50) {
  try {
    if (!fs.existsSync(ERROR_LOG_FILE)) {
      return [];
    }

    const content = fs.readFileSync(ERROR_LOG_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line);
    const errors = lines
      .slice(-limit)
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .reverse();

    return errors;
  } catch (error) {
    console.error('Failed to read error log:', error);
    return [];
  }
}

module.exports = { logError, getRecentErrors };
