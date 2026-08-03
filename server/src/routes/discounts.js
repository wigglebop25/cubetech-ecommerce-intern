const express = require('express');
const router = express.Router();
const discountRepository = require('../repositories/discountRepository');
const DiscountService = require('../services/discountService');
const DiscountController = require('../controllers/discountController');

// Dependency Injection: repository → service → controller
const discountService = new DiscountService(discountRepository);
const discountController = new DiscountController(discountService);

// POST /api/discounts/validate - validate discount code (must be before /:id)
router.post('/validate', (req, res, next) => discountController.validate(req, res, next));

// GET /api/discounts - list all discounts
router.get('/', (req, res, next) => discountController.getAll(req, res, next));

// GET /api/discounts/:id - get single discount
router.get('/:id', (req, res, next) => discountController.getById(req, res, next));

// POST /api/discounts - create new discount
router.post('/', (req, res, next) => discountController.create(req, res, next));

// PUT /api/discounts/:id - update discount
router.put('/:id', (req, res, next) => discountController.update(req, res, next));

// DELETE /api/discounts/:id - delete discount
router.delete('/:id', (req, res, next) => discountController.delete(req, res, next));

module.exports = router;
