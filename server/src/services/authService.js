const argon2 = require('argon2');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

// AuthService: authentication logic
// Receives admin repository via constructor injection (DI pattern)
class AuthService {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  // Login with username and password
  // Uses Argon2 for secure password verification
  // Returns JWT tokens
  async login(username, password) {
    // Validate required fields
    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.status = 400;
      throw error;
    }

    // Find user by username
    const user = await this.adminRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Verify password with Argon2
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Generate tokens
    const payload = { id: user.id, username: user.username, role: user.role || 'admin' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      message: 'Login successful',
      user: { id: user.id, username: user.username, role: user.role || 'admin' },
      accessToken,
      refreshToken
    };
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.status = 400;
      throw error;
    }

    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken);

      // Generate new access token
      const payload = { id: decoded.id, username: decoded.username, role: decoded.role };
      const newAccessToken = generateAccessToken(payload);

      return {
        message: 'Token refreshed successfully',
        accessToken: newAccessToken
      };
    } catch (error) {
      const authError = new Error('Invalid or expired refresh token');
      authError.status = 401;
      throw authError;
    }
  }
}

module.exports = AuthService;
