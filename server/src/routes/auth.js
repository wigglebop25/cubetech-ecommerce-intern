const express = require('express');
const router = express.Router();
const adminRepository = require('../repositories/adminRepository');
const AuthService = require('../services/authService');
const AuthController = require('../controllers/authController');

// Dependency Injection: repository → service → controller
const authService = new AuthService(adminRepository);
const authController = new AuthController(authService);

// POST /api/auth/login - authenticate user
router.post('/login', (req, res, next) => authController.login(req, res, next));

// POST /api/auth/refresh - refresh access token
router.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));

// POST /api/auth/logout - invalidate token (client-side)
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

module.exports = router;
