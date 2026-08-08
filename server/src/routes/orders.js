const express = require('express');
const router = express.Router();
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const orderStatusRepository = require('../repositories/orderStatusRepository');
const discountRepository = require('../repositories/discountRepository');
const OrderService = require('../services/orderService');
const DiscountService = require('../services/discountService');
const OrderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const { customerAuth } = require('../middleware/customerAuth');

// Dependency Injection: repositories → services → controller
const discountService = new DiscountService(discountRepository);
const orderService = new OrderService(orderRepository, productRepository, orderStatusRepository, discountService);
const orderController = new OrderController(orderService);

// Protected routes (require customer authentication)
router.post('/', customerAuth, (req, res, next) => orderController.create(req, res, next));

// Admin-only routes
router.get('/export', authenticate, authorize(['admin']), (req, res, next) => orderController.export(req, res, next));
router.get('/', authenticate, authorize(['admin']), (req, res, next) => orderController.getAll(req, res, next));
router.get('/:id', authenticate, authorize(['admin']), (req, res, next) => orderController.getById(req, res, next));
router.put('/:id/status', authenticate, authorize(['admin']), (req, res, next) => orderController.updateStatus(req, res, next));
router.put('/:id/cancel', authenticate, authorize(['admin']), (req, res, next) => orderController.cancelOrder(req, res, next));

module.exports = router;
