const { prisma } = require('../db');

// WishlistRepository: handles all database operations for wishlist
class WishlistRepository {
  // Get wishlist items for a customer
  async findByCustomerId(customerId) {
    return prisma.wishlist.findMany({
      where: { customerId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Find specific wishlist item
  async findItem(customerId, productId) {
    return prisma.wishlist.findUnique({
      where: { customerId_productId: { customerId, productId } }
    });
  }

  // Add to wishlist
  async create(customerId, productId) {
    return prisma.wishlist.create({
      data: { customerId, productId },
      include: { product: { include: { category: true } } }
    });
  }

  // Remove from wishlist
  async delete(customerId, productId) {
    return prisma.wishlist.delete({
      where: { customerId_productId: { customerId, productId } }
    });
  }

  // Clear wishlist for a customer
  async deleteAll(customerId) {
    return prisma.wishlist.deleteMany({
      where: { customerId }
    });
  }
}

module.exports = new WishlistRepository();
