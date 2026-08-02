const { prisma } = require('../db');

class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' }
    });
  }

  async findById(id) {
    return prisma.category.findUnique({ where: { id } });
  }

  async create(data) {
    return prisma.category.create({ data });
  }

  async update(id, data) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.category.delete({ where: { id } });
  }

  async getProductCount(categoryId) {
    return prisma.product.count({ where: { categoryId } });
  }
}

module.exports = new CategoryRepository();
