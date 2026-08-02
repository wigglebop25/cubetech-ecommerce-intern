class StatsController {
  constructor(statsService) {
    this.statsService = statsService;
  }

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
