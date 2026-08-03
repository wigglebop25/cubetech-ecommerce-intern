// AuthController: handles HTTP requests/responses for authentication
// Receives service via constructor injection (DI pattern)
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  // POST /api/auth/login - authenticate user
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const result = await this.authService.login(username, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/refresh - refresh access token
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/logout - invalidate token (client-side)
  async logout(req, res, next) {
    try {
      // JWT is stateless - logout is handled client-side
      // In a real app, you might blacklist the token
      res.json({ message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
