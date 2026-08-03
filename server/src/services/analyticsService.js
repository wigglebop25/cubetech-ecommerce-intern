// AnalyticsService: business logic for sales analytics
// Receives repositories via constructor injection (DI pattern)
class AnalyticsService {
  constructor(orderRepository, productRepository, categoryRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  // Get sales data by period (daily, weekly, monthly)
  async getSalesByPeriod(period = 'monthly') {
    const { orders } = await this.orderRepository.findAll({}, {}, {});
    
    // Group orders by period
    const salesByPeriod = {};
    
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      let key;
      
      switch (period) {
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        case 'weekly':
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = startOfWeek.toISOString().split('T')[0];
          break;
        case 'monthly':
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!salesByPeriod[key]) {
        salesByPeriod[key] = { period: key, orders: 0, revenue: 0 };
      }
      
      salesByPeriod[key].orders += 1;
      salesByPeriod[key].revenue += parseFloat(order.total);
    });
    
    // Convert to array and sort by period
    return Object.values(salesByPeriod).sort((a, b) => a.period.localeCompare(b.period));
  }

  // Get top selling products
  async getTopProducts(limit = 10) {
    const { orders } = await this.orderRepository.findAll({}, {}, {});
    
    // Aggregate product sales
    const productSales = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              productId: item.productId,
              productName: item.productName,
              totalQuantity: 0,
              totalRevenue: 0
            };
          }
          productSales[item.productId].totalQuantity += item.quantity;
          productSales[item.productId].totalRevenue += parseFloat(item.price) * item.quantity;
        });
      }
    });
    
    // Convert to array, sort by quantity, and limit
    return Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, limit);
  }

  // Get revenue by category
  async getRevenueByCategory() {
    const { orders } = await this.orderRepository.findAll({}, {}, {});
    const { products } = await this.productRepository.findAll({}, {}, {});
    const categories = await this.categoryRepository.findAll();
    
    // Create product to category map
    const productCategoryMap = {};
    products.forEach(product => {
      productCategoryMap[product.id] = product.category?.name || 'Unknown';
    });
    
    // Aggregate revenue by category
    const revenueByCategory = {};
    
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const category = productCategoryMap[item.productId] || 'Unknown';
          
          if (!revenueByCategory[category]) {
            revenueByCategory[category] = { category, revenue: 0, orders: 0 };
          }
          
          revenueByCategory[category].revenue += parseFloat(item.price) * item.quantity;
          revenueByCategory[category].orders += 1;
        });
      }
    });
    
    return Object.values(revenueByCategory).sort((a, b) => b.revenue - a.revenue);
  }

  // Get dashboard summary
  async getDashboardSummary() {
    const { orders } = await this.orderRepository.findAll({}, {}, {});
    const { products } = await this.productRepository.findAll({}, {}, {});
    
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    
    const totalRevenue = orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + parseFloat(o.total), 0);
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / completedOrders : 0;
    
    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5);
    
    return {
      totalOrders,
      totalProducts,
      pendingOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue,
      recentOrders
    };
  }
}

module.exports = AnalyticsService;
