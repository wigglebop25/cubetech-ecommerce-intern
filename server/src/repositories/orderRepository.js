const { prisma } = require('../db');

// OrderRepository: handles all database operations for orders
class OrderRepository {
  // Get all orders with items, optionally filtered
  async findAll(filters = {}) {
    return prisma.order.findMany({
      where: filters,
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get single order by ID with items
  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });
  }

  // Create new order with items
  async create(data) {
    return prisma.order.create({
      data,
      include: { items: true }
    });
  }

  // Update order status only
  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true }
    });
  }

  // Count total orders (used for order ID generation)
  async count() {
    return prisma.order.count();
  }
}

module.exports = new OrderRepository();
