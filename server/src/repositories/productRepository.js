const { prisma } = require('../db');

// ProductRepository: handles all database operations for products
class ProductRepository {
  // Get all products with filters, sorting, and pagination
  async findAll(filters = {}, sort = {}, pagination = {}) {
    const { offset, limit } = pagination;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        include: { category: true },
        orderBy: sort,
        skip: offset,
        take: limit
      }),
      prisma.product.count({ where: filters })
    ]);
    
    return { products, total };
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

  // Bulk create products
  async bulkCreate(products) {
    return prisma.product.createMany({ data: products });
  }

  // Bulk update products
  async bulkUpdate(updates) {
    return Promise.all(
      updates.map(({ id, data }) => prisma.product.update({ where: { id }, data }))
    );
  }

  // Bulk delete products
  async bulkDelete(ids) {
    return prisma.product.deleteMany({ where: { id: { in: ids } } });
  }
}

module.exports = new ProductRepository();
