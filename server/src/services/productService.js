// ProductService: business logic for products
// Receives repository via constructor injection (DI pattern)
class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  // Get products with optional filters
  async getProducts(filters) {
    return this.productRepository.findAll(filters);
  }

  // Get single product, throw 404 if not found
  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    return product;
  }

  // Create product with validation (price must be > 0)
  async createProduct(data) {
    if (data.price <= 0) {
      const error = new Error('Price must be greater than 0');
      error.status = 400;
      throw error;
    }
    return this.productRepository.create(data);
  }

  // Update product (verify it exists first)
  async updateProduct(id, data) {
    await this.getProductById(id);
    return this.productRepository.update(id, data);
  }

  // Delete product (verify it exists first)
  async deleteProduct(id) {
    await this.getProductById(id);
    return this.productRepository.delete(id);
  }
}

module.exports = ProductService;
