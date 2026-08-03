const argon2 = require('argon2');

// AuthService: authentication logic
// Receives admin repository via constructor injection (DI pattern)
class AuthService {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  // Login with username and password
  // Uses Argon2 for secure password verification
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

    return {
      message: 'Login successful',
      user: { id: user.id, username: user.username }
    };
  }
}

module.exports = AuthService;
