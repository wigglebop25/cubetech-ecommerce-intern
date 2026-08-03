const express = require('express');
const router = express.Router();

// Health check endpoint - simple API status check
router.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
