const express = require('express');
const router = express.Router();
const orderRepository = require('../repositories/orderRepository');
const OrderService = require('../services/orderService');
const CustomerOrderService = require('../services/customerOrderService');
const CustomerOrderController = require('../controllers/customerOrderController');
const { customerAuth } = require('../middleware/customerAuth');

// Dependency Injection
const orderService = new OrderService(orderRepository);
const customerOrderService = new CustomerOrderService(orderRepository, orderService);
const customerOrderController = new CustomerOrderController(customerOrderService);

// All routes require customer authentication
router.use(customerAuth);

// GET /api/customer/orders - list customer orders with pagination
router.get('/', (req, res, next) => customerOrderController.getOrders(req, res, next));

// GET /api/customer/orders/:id - get specific order
router.get('/:id', (req, res, next) => customerOrderController.getOrder(req, res, next));

// PUT /api/customer/orders/:id/cancel - cancel order
router.put('/:id/cancel', (req, res, next) => customerOrderController.cancelOrder(req, res, next));

module.exports = router;
