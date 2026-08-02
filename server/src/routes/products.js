const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');
const ProductService = require('../services/productService');
const ProductController = require('../controllers/productController');

const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get('/', (req, res, next) => productController.getAll(req, res, next));
router.get('/:id', (req, res, next) => productController.getById(req, res, next));
router.post('/', (req, res, next) => productController.create(req, res, next));
router.put('/:id', (req, res, next) => productController.update(req, res, next));
router.delete('/:id', (req, res, next) => productController.delete(req, res, next));

module.exports = router;
