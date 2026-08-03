const express = require('express');
const router = express.Router();
const customerRepository = require('../repositories/customerRepository');
const orderRepository = require('../repositories/orderRepository');
const CustomerAuthService = require('../services/customerAuthService');
const CustomerAuthController = require('../controllers/customerAuthController');
const { customerAuth } = require('../middleware/customerAuth');

// Dependency Injection: repository → service → controller
const customerAuthService = new CustomerAuthService(customerRepository);
const customerAuthController = new CustomerAuthController(customerAuthService);

// GET /api/customers - get all customers derived from orders (admin endpoint)
router.get('/', async (req, res, next) => {
  try {
    const { orders } = await orderRepository.findAll({}, {}, {});

    // Group orders by email to derive customers
    const customerMap = {};
    orders.forEach(order => {
      if (!customerMap[order.email]) {
        customerMap[order.email] = {
          name: order.customerName,
          email: order.email,
          phone: order.phone,
          orderCount: 0,
          totalSpent: 0,
          status: 'Active'
        };
      }
      customerMap[order.email].orderCount += 1;
      customerMap[order.email].totalSpent += parseFloat(order.total);
    });

    res.json(Object.values(customerMap));
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
