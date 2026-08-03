// StatsService: aggregates data for dashboard statistics
// Receives product and order repositories via constructor injection (DI pattern)
class StatsService {
  constructor(productRepository, orderRepository) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
  }

  // Calculate dashboard statistics
  async getStats() {
    const products = await this.productRepository.findAll();
    const orders = await this.orderRepository.findAll();

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;

    // Count unique customers by email
    const uniqueEmails = new Set(orders.map(o => o.email));
    const totalCustomers = uniqueEmails.size;

    // Sum total sales from completed orders
    const totalSales = orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + parseFloat(o.total), 0);

    return { totalProducts, totalOrders, pendingOrders, completedOrders, totalCustomers, totalSales };
  }
}

module.exports = StatsService;
