class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  async getAll(req, res, next) {
    try {
      const { category, status, search } = req.query;
      const filters = {};
      if (category) filters.category = { name: category };
      if (status) filters.status = status;
      if (search) filters.name = { contains: search };

      const products = await this.productService.getProducts(filters);
      res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await this.productService.getProductById(parseInt(req.params.id));
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await this.productService.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.productService.deleteProduct(parseInt(req.params.id));
      res.json({ message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
