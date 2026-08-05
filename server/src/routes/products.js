const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');
const ProductService = require('../services/productService');
const ProductController = require('../controllers/productController');
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');

// Dependency Injection: repository → service → controller
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Public routes (no auth required)
router.get('/export', (req, res, next) => productController.export(req, res, next));
router.get('/low-stock', (req, res, next) => productController.getLowStock(req, res, next));
router.get('/', (req, res, next) => productController.getAll(req, res, next));
router.get('/:id', (req, res, next) => productController.getById(req, res, next));

// Admin-only routes (auth + role required)
router.post('/bulk', authenticate, authorize(['admin']), (req, res, next) => productController.bulkCreate(req, res, next));
router.put('/bulk', authenticate, authorize(['admin']), (req, res, next) => productController.bulkUpdate(req, res, next));
router.delete('/bulk', authenticate, authorize(['admin']), (req, res, next) => productController.bulkDelete(req, res, next));
router.post('/', authenticate, authorize(['admin']), (req, res, next) => productController.create(req, res, next));
router.put('/:id', authenticate, authorize(['admin']), (req, res, next) => productController.update(req, res, next));
router.delete('/:id', authenticate, authorize(['admin']), (req, res, next) => productController.delete(req, res, next));
router.post('/:id/image', authenticate, authorize(['admin']), upload.single('image'), (req, res, next) => productController.uploadImage(req, res, next));

module.exports = router;
