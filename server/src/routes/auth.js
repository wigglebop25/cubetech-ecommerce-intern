const express = require('express');
const router = express.Router();
const adminRepository = require('../repositories/adminRepository');
const AuthService = require('../services/authService');
const AuthController = require('../controllers/authController');

const authService = new AuthService(adminRepository);
const authController = new AuthController(authService);

router.post('/login', (req, res, next) => authController.login(req, res, next));

module.exports = router;
