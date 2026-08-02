const express = require('express');
const router = express.Router();
const categoryRepository = require('../repositories/categoryRepository');
const CategoryService = require('../services/categoryService');
const CategoryController = require('../controllers/categoryController');

const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get('/', (req, res, next) => categoryController.getAll(req, res, next));
router.post('/', (req, res, next) => categoryController.create(req, res, next));
router.put('/:id', (req, res, next) => categoryController.update(req, res, next));
router.delete('/:id', (req, res, next) => categoryController.delete(req, res, next));

module.exports = router;
