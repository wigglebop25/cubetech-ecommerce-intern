const { prisma } = require('../db');

// ProductRepository: handles all database operations for products
class ProductRepository {
  // Get all products, optionally filtered by category/status/search
  async findAll(filters = {}) {
    return prisma.product.findMany({
      where: filters,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get single product by ID with category relation
  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });
  }

  // Create new product
  async create(data) {
    return prisma.product.create({
      data,
      include: { category: true }
    });
  }

  // Update existing product
  async update(id, data) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true }
    });
  }

  // Delete product by ID
  async delete(id) {
    return prisma.product.delete({ where: { id } });
  }
}

module.exports = new ProductRepository();
