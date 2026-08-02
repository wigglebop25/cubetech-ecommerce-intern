const argon2 = require('argon2');

class AuthService {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  async login(username, password) {
    if (!username || !password) {
      const error = new Error('Username and password are required');
      error.status = 400;
      throw error;
    }

    const user = await this.adminRepository.findByUsername(username);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

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
