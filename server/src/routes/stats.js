const express = require('express');
const router = express.Router();
const productRepository = require('../repositories/productRepository');
const orderRepository = require('../repositories/orderRepository');
const StatsService = require('../services/statsService');
const StatsController = require('../controllers/statsController');

const statsService = new StatsService(productRepository, orderRepository);
const statsController = new StatsController(statsService);

router.get('/', (req, res, next) => statsController.getStats(req, res, next));

module.exports = router;
