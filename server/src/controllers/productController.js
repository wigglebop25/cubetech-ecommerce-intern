const { paginate, getPaginationMeta } = require('../utils/pagination');
const { parseSort } = require('../utils/sorting');
const { buildProductFilters } = require('../utils/filtering');
const { toCSV, toJSON } = require('../utils/export');

// ProductController: handles HTTP requests/responses for products
// Receives service via constructor injection (DI pattern)
// Delegates business logic to service, only handles req/res
class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  // GET /api/products - list all products with filters, sorting, pagination
  async getAll(req, res, next) {
    try {
      const { page, limit, sort, ...query } = req.query;
      
      const filters = buildProductFilters(query);
      const orderBy = parseSort(sort);
      const pagination = paginate(page, limit);
      
      const { products, total } = await this.productService.getProducts(filters, orderBy, pagination);
      const paginationMeta = getPaginationMeta(total, page, limit);
      
      res.json({ data: products, pagination: paginationMeta });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/products/:id - get single product
  async getById(req, res, next) {
    try {
      const product = await this.productService.getProductById(parseInt(req.params.id));
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/products - create new product
  async create(req, res, next) {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/products/:id - update product
  async update(req, res, next) {
    try {
      const product = await this.productService.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/products/:id - delete product
  async delete(req, res, next) {
    try {
      await this.productService.deleteProduct(parseInt(req.params.id));
      res.json({ message: 'Product deleted' });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/products/export - export products to CSV or JSON
  async export(req, res, next) {
    try {
      const { format = 'csv', ...query } = req.query;
      const filters = buildProductFilters(query);
      
      const { products } = await this.productService.getProducts(filters, {}, {});
      
      const columns = ['id', 'name', 'category', 'price', 'stock', 'status'];
      const exportData = products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category?.name || '',
        price: p.price,
        stock: p.stock,
        status: p.status
      }));
      
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=products.json');
        res.send(toJSON(exportData));
      } else {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
        res.send(toCSV(exportData, columns));
      }
    } catch (error) {
      next(error);
    }
  }

  // POST /api/products/bulk - bulk create products
  async bulkCreate(req, res, next) {
    try {
      const result = await this.productService.bulkCreateProducts(req.body);
      res.status(201).json({ message: `${result.count} products created` });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/products/bulk - bulk update products
  async bulkUpdate(req, res, next) {
    try {
      const result = await this.productService.bulkUpdateProducts(req.body);
      res.json({ message: `${result.length} products updated` });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/products/bulk - bulk delete products
  async bulkDelete(req, res, next) {
    try {
      const { ids } = req.body;
      const result = await this.productService.bulkDeleteProducts(ids);
      res.json({ message: `${result.count} products deleted` });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/products/low-stock - get low stock products
  async getLowStock(req, res, next) {
    try {
      const products = await this.productService.getLowStockProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
