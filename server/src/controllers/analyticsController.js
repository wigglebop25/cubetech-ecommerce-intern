// AnalyticsController: handles HTTP requests/responses for analytics
// Receives service via constructor injection (DI pattern)
class AnalyticsController {
  constructor(analyticsService) {
    this.analyticsService = analyticsService;
  }

  // GET /api/analytics/sales - get sales by period
  async getSales(req, res, next) {
    try {
      const { period = 'monthly' } = req.query;
      const sales = await this.analyticsService.getSalesByPeriod(period);
      res.json(sales);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/analytics/top-products - get top selling products
  async getTopProducts(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const products = await this.analyticsService.getTopProducts(parseInt(limit));
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/analytics/revenue - get revenue by category
  async getRevenue(req, res, next) {
    try {
      const revenue = await this.analyticsService.getRevenueByCategory();
      res.json(revenue);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/analytics/dashboard - get dashboard summary
  async getDashboard(req, res, next) {
    try {
      const summary = await this.analyticsService.getDashboardSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AnalyticsController;
