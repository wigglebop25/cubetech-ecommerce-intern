const express = require('express');
const router = express.Router();
const orderRepository = require('../repositories/orderRepository');
const CustomerService = require('../services/customerService');
const CustomerController = require('../controllers/customerController');

const customerService = new CustomerService(orderRepository);
const customerController = new CustomerController(customerService);

router.get('/', (req, res, next) => customerController.getAll(req, res, next));

module.exports = router;
