const jwt = require('jsonwebtoken');

// Customer JWT configuration (separate from admin)
const CUSTOMER_JWT_SECRET = process.env.CUSTOMER_JWT_SECRET || 'cubetech-customer-secret-2026';
const CUSTOMER_JWT_EXPIRES_IN = '24h'; // Customer tokens last 24 hours

/**
 * Generate customer access token
 * @param {Object} payload - Customer data to encode
 * @returns {string} JWT token
 */
function generateCustomerToken(payload) {
  return jwt.sign(payload, CUSTOMER_JWT_SECRET, { expiresIn: CUSTOMER_JWT_EXPIRES_IN });
}

/**
 * Verify and decode customer JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload
 * @throws {Error} If token is invalid or expired
 */
function verifyCustomerToken(token) {
  return jwt.verify(token, CUSTOMER_JWT_SECRET);
}

module.exports = {
  generateCustomerToken,
  verifyCustomerToken,
  CUSTOMER_JWT_SECRET,
  CUSTOMER_JWT_EXPIRES_IN
};
