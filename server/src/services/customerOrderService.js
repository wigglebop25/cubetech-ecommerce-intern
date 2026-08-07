const { prisma } = require('../db');

class CustomerOrderService {
  constructor(orderRepository, orderService) {
    this.orderRepository = orderRepository;
    this.orderService = orderService;
  }

  async getCustomerOrders(customerEmail, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { email: customerEmail },
        orderBy: { orderDate: 'desc' },
        skip,
        take: limit,
        include: { items: true }
      }),
      prisma.order.count({ where: { email: customerEmail } })
    ]);
    return {
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getCustomerOrder(orderId, customerEmail) {
    const order = await this.orderRepository.findById(orderId);
    if (!order || order.email !== customerEmail) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }
    return order;
  }

  async cancelOrder(orderId, customerEmail) {
    const order = await this.getCustomerOrder(orderId, customerEmail);
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      const error = new Error('Cannot cancel order with status ' + order.status);
      error.status = 400;
      throw error;
    }
    return this.orderService.updateOrderStatus(orderId, 'Cancelled');
  }
}

module.exports = CustomerOrderService;
