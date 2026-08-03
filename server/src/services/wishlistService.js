// WishlistService: business logic for wishlist
// Receives repository via constructor injection (DI pattern)
class WishlistService {
  constructor(wishlistRepository) {
    this.wishlistRepository = wishlistRepository;
  }

  // Get customer's wishlist
  async getWishlist(customerId) {
    return this.wishlistRepository.findByCustomerId(customerId);
  }

  // Add product to wishlist
  async addToWishlist(customerId, productId) {
    // Check if already in wishlist
    const existing = await this.wishlistRepository.findItem(customerId, productId);
    if (existing) {
      const error = new Error('Product already in wishlist');
      error.status = 400;
      throw error;
    }

    return this.wishlistRepository.create(customerId, productId);
  }

  // Remove product from wishlist
  async removeFromWishlist(customerId, productId) {
    const existing = await this.wishlistRepository.findItem(customerId, productId);
    if (!existing) {
      const error = new Error('Product not in wishlist');
      error.status = 404;
      throw error;
    }

    return this.wishlistRepository.delete(customerId, productId);
  }

  // Clear wishlist
  async clearWishlist(customerId) {
    return this.wishlistRepository.deleteAll(customerId);
  }
}

module.exports = WishlistService;
