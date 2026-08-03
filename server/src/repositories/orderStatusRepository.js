const { prisma } = require('../db');

// OrderStatusRepository: handles order status history operations
class OrderStatusRepository {
  // Add status history entry
  async create(orderId, status, notes = null) {
    return prisma.orderStatusHistory.create({
      data: {
        orderId,
        status,
        notes
      }
    });
  }

  // Get all status history for an order
  async findByOrderId(orderId) {
    return prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = new OrderStatusRepository();
