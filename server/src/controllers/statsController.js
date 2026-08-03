// StatsController: handles HTTP requests/responses for dashboard statistics
// Receives service via constructor injection (DI pattern)
class StatsController {
  constructor(statsService) {
    this.statsService = statsService;
  }

  // GET /api/stats - get dashboard statistics
  async getStats(req, res, next) {
    try {
      const stats = await this.statsService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StatsController;
