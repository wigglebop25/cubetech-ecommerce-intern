class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async getProducts(filters) {
    return this.productRepository.findAll(filters);
  }

  async getProductById(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.status = 404;
      throw error;
    }
    return product;
  }

  async createProduct(data) {
    if (data.price <= 0) {
      const error = new Error('Price must be greater than 0');
      error.status = 400;
      throw error;
    }
    return this.productRepository.create(data);
  }

  async updateProduct(id, data) {
    await this.getProductById(id);
    return this.productRepository.update(id, data);
  }

  async deleteProduct(id) {
    await this.getProductById(id);
    return this.productRepository.delete(id);
  }
}

module.exports = ProductService;
