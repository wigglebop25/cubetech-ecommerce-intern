const express = require('express');
const router = express.Router();
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');
const AnalyticsService = require('../services/analyticsService');
const AnalyticsController = require('../controllers/analyticsController');

// Dependency Injection: repositories → service → controller
const analyticsService = new AnalyticsService(orderRepository, productRepository, categoryRepository);
const analyticsController = new AnalyticsController(analyticsService);

// GET /api/analytics/sales - get sales by period
router.get('/sales', (req, res, next) => analyticsController.getSales(req, res, next));

// GET /api/analytics/top-products - get top selling products
router.get('/top-products', (req, res, next) => analyticsController.getTopProducts(req, res, next));

// GET /api/analytics/revenue - get revenue by category
router.get('/revenue', (req, res, next) => analyticsController.getRevenue(req, res, next));

// GET /api/analytics/dashboard - get dashboard summary
router.get('/dashboard', (req, res, next) => analyticsController.getDashboard(req, res, next));

module.exports = router;
