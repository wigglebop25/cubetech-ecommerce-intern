const { prisma } = require('../db');

// DiscountRepository: handles all database operations for discounts
class DiscountRepository {
  // Get all discounts
  async findAll() {
    return prisma.discount.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get discount by ID
  async findById(id) {
    return prisma.discount.findUnique({ where: { id } });
  }

  // Get discount by code
  async findByCode(code) {
    return prisma.discount.findUnique({ where: { code } });
  }

  // Create discount
  async create(data) {
    return prisma.discount.create({ data });
  }

  // Update discount
  async update(id, data) {
    return prisma.discount.update({ where: { id }, data });
  }

  // Delete discount
  async delete(id) {
    return prisma.discount.delete({ where: { id } });
  }

  // Increment used count
  async incrementUsedCount(id) {
    return prisma.discount.update({
      where: { id },
      data: { usedCount: { increment: 1 } }
    });
  }
}

module.exports = new DiscountRepository();
