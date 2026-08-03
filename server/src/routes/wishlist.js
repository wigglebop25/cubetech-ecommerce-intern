const express = require('express');
const router = express.Router();
const wishlistRepository = require('../repositories/wishlistRepository');
const WishlistService = require('../services/wishlistService');
const WishlistController = require('../controllers/wishlistController');
const { customerAuth } = require('../middleware/customerAuth');

// Dependency Injection: repository → service → controller
const wishlistService = new WishlistService(wishlistRepository);
const wishlistController = new WishlistController(wishlistService);

// All wishlist routes require customer authentication
router.use(customerAuth);

// GET /api/wishlist - get customer's wishlist
router.get('/', (req, res, next) => wishlistController.getAll(req, res, next));

// DELETE /api/wishlist - clear wishlist
router.delete('/', (req, res, next) => wishlistController.clear(req, res, next));

// POST /api/wishlist - add product to wishlist
router.post('/', (req, res, next) => wishlistController.add(req, res, next));

// DELETE /api/wishlist/:productId - remove from wishlist
router.delete('/:productId', (req, res, next) => wishlistController.remove(req, res, next));

module.exports = router;
