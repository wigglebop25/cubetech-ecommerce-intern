const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');
const ProductService = require('../services/productService');
const ProductController = require('../controllers/productController');
const upload = require('../middleware/upload');
const { authenticate } = require('../middleware/auth');

// Dependency Injection: repository → service → controller
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// GET /api/products/export - export products (must be before /:id)
router.get('/export', (req, res, next) => productController.export(req, res, next));

// GET /api/products/low-stock - get low stock products (must be before /:id)
router.get('/low-stock', (req, res, next) => productController.getLowStock(req, res, next));

// POST /api/products/bulk - bulk create products (requires auth)
router.post('/bulk', authenticate, (req, res, next) => productController.bulkCreate(req, res, next));

// PUT /api/products/bulk - bulk update products (requires auth)
router.put('/bulk', authenticate, (req, res, next) => productController.bulkUpdate(req, res, next));

// DELETE /api/products/bulk - bulk delete products (requires auth)
router.delete('/bulk', authenticate, (req, res, next) => productController.bulkDelete(req, res, next));

// GET /api/products - list all products with filters, sorting, pagination
router.get('/', (req, res, next) => productController.getAll(req, res, next));

// GET /api/products/:id - get single product
router.get('/:id', (req, res, next) => productController.getById(req, res, next));

// POST /api/products - create new product (requires auth)
router.post('/', authenticate, (req, res, next) => productController.create(req, res, next));

// PUT /api/products/:id - update product (requires auth)
router.put('/:id', authenticate, (req, res, next) => productController.update(req, res, next));

// DELETE /api/products/:id - delete product (requires auth)
router.delete('/:id', authenticate, (req, res, next) => productController.delete(req, res, next));

// POST /api/products/:id/image - upload product image (requires auth)
router.post('/:id/image', authenticate, upload.single('image'), (req, res, next) => productController.uploadImage(req, res, next));

module.exports = router;
