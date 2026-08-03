const express = require('express');
const router = express.Router();
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const orderStatusRepository = require('../repositories/orderStatusRepository');
const discountRepository = require('../repositories/discountRepository');
const OrderService = require('../services/orderService');
const DiscountService = require('../services/discountService');
const OrderController = require('../controllers/orderController');

// Dependency Injection: repositories → services → controller
const discountService = new DiscountService(discountRepository);
const orderService = new OrderService(orderRepository, productRepository, orderStatusRepository, discountService);
const orderController = new OrderController(orderService);

// GET /api/orders/export - export orders (must be before /:id)
router.get('/export', (req, res, next) => orderController.export(req, res, next));

// GET /api/orders - list all orders with filters, sorting, pagination
router.get('/', (req, res, next) => orderController.getAll(req, res, next));

// GET /api/orders/:id - get single order with status history
router.get('/:id', (req, res, next) => orderController.getById(req, res, next));

// POST /api/orders - create new order (with optional discount code)
router.post('/', (req, res, next) => orderController.create(req, res, next));

// PUT /api/orders/:id/status - update order status with history
router.put('/:id/status', (req, res, next) => orderController.updateStatus(req, res, next));

module.exports = router;
