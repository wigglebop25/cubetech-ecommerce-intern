const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');
const ProductService = require('../services/productService');
const ProductController = require('../controllers/productController');

// Dependency Injection: repository → service → controller
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// GET /api/products/export - export products (must be before /:id)
router.get('/export', (req, res, next) => productController.export(req, res, next));

// GET /api/products/low-stock - get low stock products (must be before /:id)
router.get('/low-stock', (req, res, next) => productController.getLowStock(req, res, next));

// POST /api/products/bulk - bulk create products
router.post('/bulk', (req, res, next) => productController.bulkCreate(req, res, next));

// PUT /api/products/bulk - bulk update products
router.put('/bulk', (req, res, next) => productController.bulkUpdate(req, res, next));

// DELETE /api/products/bulk - bulk delete products
router.delete('/bulk', (req, res, next) => productController.bulkDelete(req, res, next));

// GET /api/products - list all products with filters, sorting, pagination
router.get('/', (req, res, next) => productController.getAll(req, res, next));

// GET /api/products/:id - get single product
router.get('/:id', (req, res, next) => productController.getById(req, res, next));

// POST /api/products - create new product
router.post('/', (req, res, next) => productController.create(req, res, next));

// PUT /api/products/:id - update product
router.put('/:id', (req, res, next) => productController.update(req, res, next));

// DELETE /api/products/:id - delete product
router.delete('/:id', (req, res, next) => productController.delete(req, res, next));

module.exports = router;
