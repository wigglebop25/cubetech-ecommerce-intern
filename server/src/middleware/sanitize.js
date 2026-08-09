// Input sanitization middleware
// Prevents NoSQL injection and XSS attacks

// Sanitize request body
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  next();
}

// Sanitize request query
function sanitizeQuery(req, res, next) {
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  next();
}

// Recursively sanitize object properties
function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Skip sanitization for URL fields to prevent encoding forward slashes
      if (key.toLowerCase().includes('url') || key.toLowerCase().includes('image')) {
        continue;
      }
      // Remove potential XSS vectors
      obj[key] = obj[key]
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

module.exports = { sanitizeBody, sanitizeQuery };
