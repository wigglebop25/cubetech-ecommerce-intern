// StatsService: aggregates data for dashboard statistics
// Receives product, order, and customer repositories via constructor injection (DI pattern)
class StatsService {
  constructor(productRepository, orderRepository, customerRepository) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.customerRepository = customerRepository;
  }

  // Calculate dashboard statistics
  async getStats() {
    // Get all products and orders (no filters, no pagination)
    const { products } = await this.productRepository.findAll({}, {}, {});
    const { orders } = await this.orderRepository.findAll({}, {}, {});

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;

    // Count customers from Customer table
    const totalCustomers = await this.customerRepository.count();

    // Sum total sales from completed orders
    const totalSales = orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + parseFloat(o.total), 0);

    return { totalProducts, totalOrders, pendingOrders, completedOrders, totalCustomers, totalSales };
  }
}

module.exports = StatsService;
