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
}

module.exports = AuthController;
