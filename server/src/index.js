const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const { sanitizeBody, sanitizeQuery } = require('./middleware/sanitize');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Import routes
const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const authRoutes = require('./routes/auth');
const statsRoutes = require('./routes/stats');
const discountRoutes = require('./routes/discounts');
const wishlistRoutes = require('./routes/wishlist');
const analyticsRoutes = require('./routes/analytics');
const customerOrderRoutes = require('./routes/customerOrders');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS
app.use(apiLimiter); // Rate limiting for all API routes

// Request parsing
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sanitization middleware
app.use(sanitizeBody); // Sanitize request body
app.use(sanitizeQuery); // Sanitize query parameters

// Logging middleware
app.use(requestLogger); // Log all requests

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authLimiter, authRoutes); // Stricter rate limit for admin auth
app.use('/api/stats', statsRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customer/orders', customerOrderRoutes);

// Error handling middleware (must be after routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
