const { prisma } = require('../db');

class ProductRepository {
  async findAll(filters = {}) {
    return prisma.product.findMany({
      where: filters,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  async create(data) {
    return prisma.product.create({
      data,
      include: { category: true }
    });
  }

  async update(id, data) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  async delete(id) {
    return prisma.product.delete({ where: { id } });
  }
}

module.exports = new ProductRepository();
