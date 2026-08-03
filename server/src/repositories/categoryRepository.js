const { prisma } = require('../db');

// CategoryRepository: handles all database operations for categories
class CategoryRepository {
  // Get all categories with product count
  async findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
  }

  // Get single category by ID
  async findById(id) {
    return prisma.category.findUnique({ where: { id } });
  }

  // Create new category
  async create(data) {
    return prisma.category.create({ data });
  }

  // Update existing category
  async update(id, data) {
    return prisma.category.update({ where: { id }, data });
  }

  // Delete category by ID
  async delete(id) {
    return prisma.category.delete({ where: { id } });
  }

  // Count products in a category (used for deletion guard)
  async getProductCount(categoryId) {
    return prisma.product.count({ where: { categoryId } });
  }
}

module.exports = new CategoryRepository();
