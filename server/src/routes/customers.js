const express = require('express');
const router = express.Router();
const customerRepository = require('../repositories/customerRepository');
const orderRepository = require('../repositories/orderRepository');
const CustomerAuthService = require('../services/customerAuthService');
const CustomerAuthController = require('../controllers/customerAuthController');
const { customerAuth } = require('../middleware/customerAuth');
const { prisma } = require('../db');

// Dependency Injection: repository → service → controller
const customerAuthService = new CustomerAuthService(customerRepository);
const customerAuthController = new CustomerAuthController(customerAuthService);

// GET /api/customers - get all customers from Customer table enriched with order data (admin endpoint)
router.get('/', async (req, res, next) => {
  try {
    // Get all customers from Customer table
    const allCustomers = await prisma.customer.findMany({
      select: { id: true, name: true, email: true, phone: true, createdAt: true }
    });

    // Get orders to calculate orderCount and totalSpent
    const { orders } = await orderRepository.findAll({}, {}, {});

    // Build order stats by email
    const orderStats = {};
    orders.forEach(order => {
      if (!orderStats[order.email]) {
        orderStats[order.email] = { orderCount: 0, totalSpent: 0 };
      }
      orderStats[order.email].orderCount += 1;
      orderStats[order.email].totalSpent += parseFloat(order.total);
    });

    // Merge customers with order stats
    const customers = allCustomers.map(customer => ({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      orderCount: orderStats[customer.email]?.orderCount || 0,
      totalSpent: orderStats[customer.email]?.totalSpent || 0,
      status: 'Active'
    }));

    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// POST /api/customers/register - register new customer
router.post('/register', (req, res, next) => customerAuthController.register(req, res, next));

// POST /api/customers/login - customer login
router.post('/login', (req, res, next) => customerAuthController.login(req, res, next));

// GET /api/customers/profile - get customer profile (protected)
router.get('/profile', customerAuth, (req, res, next) => customerAuthController.getProfile(req, res, next));

// PUT /api/customers/profile - update customer profile (protected)
router.put('/profile', customerAuth, (req, res, next) => customerAuthController.updateProfile(req, res, next));

// PUT /api/customers/address - update customer address (protected)
router.put('/address', customerAuth, (req, res, next) => customerAuthController.updateAddress(req, res, next));

module.exports = router;
