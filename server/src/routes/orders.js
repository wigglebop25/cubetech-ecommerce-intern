const express = require('express');
const router = express.Router();
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const OrderService = require('../services/orderService');
const OrderController = require('../controllers/orderController');

// Dependency Injection: repositories → service → controller
const orderService = new OrderService(orderRepository, productRepository);
const orderController = new OrderController(orderService);

router.get('/', (req, res, next) => orderController.getAll(req, res, next));
router.get('/:id', (req, res, next) => orderController.getById(req, res, next));
router.post('/', (req, res, next) => orderController.create(req, res, next));
router.put('/:id/status', (req, res, next) => orderController.updateStatus(req, res, next));

module.exports = router;
