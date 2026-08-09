const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');
const orderRepository = require('../repositories/orderRepository');
const customerRepository = require('../repositories/customerRepository');
const StatsService = require('../services/statsService');
const StatsController = require('../controllers/statsController');

// Dependency Injection: repositories → service → controller
const statsService = new StatsService(productRepository, orderRepository, customerRepository);
const statsController = new StatsController(statsService);

router.get('/', (req, res, next) => statsController.getStats(req, res, next));

module.exports = router;
