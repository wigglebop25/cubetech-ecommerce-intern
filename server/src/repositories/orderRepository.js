const { prisma } = require('../db');

class OrderRepository {
  async findAll(filters = {}) {
    return prisma.order.findMany({
      where: filters,
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });
  }

  async create(data) {
    return prisma.order.create({
      data,
      include: { items: true }
    });
  }

  async updateStatus(id, status) {
    return prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true }
    });
  }

  async count() {
    return prisma.order.count();
  }
}

module.exports = new OrderRepository();
