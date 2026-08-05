const express = require('express');
const router = express.Router();
const categoryRepository = require('../repositories/categoryRepository');
const CategoryService = require('../services/categoryService');
const CategoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

// Dependency Injection: repository → service → controller
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

// Public routes
router.get('/', (req, res, next) => categoryController.getAll(req, res, next));

// Admin-only routes
router.post('/', authenticate, authorize(['admin']), (req, res, next) => categoryController.create(req, res, next));
router.put('/:id', authenticate, authorize(['admin']), (req, res, next) => categoryController.update(req, res, next));
router.delete('/:id', authenticate, authorize(['admin']), (req, res, next) => categoryController.delete(req, res, next));

module.exports = router;
