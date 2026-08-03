// WishlistController: handles HTTP requests/responses for wishlist
// Receives service via constructor injection (DI pattern)
class WishlistController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
  }

  // GET /api/wishlist - get customer's wishlist
  async getAll(req, res, next) {
    try {
      const wishlist = await this.wishlistService.getWishlist(req.customer.id);
      res.json(wishlist);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/wishlist - add product to wishlist
  async add(req, res, next) {
    try {
      const { productId } = req.body;
      const item = await this.wishlistService.addToWishlist(req.customer.id, productId);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/wishlist/:productId - remove from wishlist
  async remove(req, res, next) {
    try {
      const productId = parseInt(req.params.productId);
      await this.wishlistService.removeFromWishlist(req.customer.id, productId);
      res.json({ message: 'Removed from wishlist' });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/wishlist - clear wishlist
  async clear(req, res, next) {
    try {
      await this.wishlistService.clearWishlist(req.customer.id);
      res.json({ message: 'Wishlist cleared' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = WishlistController;
