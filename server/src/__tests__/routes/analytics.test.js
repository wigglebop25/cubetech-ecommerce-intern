const request = require('supertest');
const express = require('express');
const analyticsRoutes = require('../../routes/analytics');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/analytics', analyticsRoutes);
app.use(errorHandler);

describe('Analytics Routes', () => {
  beforeEach(async () => {
    // Create test data
    const category = await prisma.category.create({
      data: { name: 'Test Category', description: 'Test' }
    });
    const product = await prisma.product.create({
      data: { name: 'Test Product', image: 'img.jpg', categoryId: category.id, price: 500, stock: 10 }
    });
    await prisma.order.create({
      data: {
        id: 'ORD-TEST-001',
        customerName: 'Test Customer',
        email: 'test@test.com',
        phone: '09171234567',
        address: '123 Test St',
        subtotal: 500,
        tax: 60,
        shippingCost: 0,
        total: 560,
        paymentMethod: 'Cash on Delivery',
        status: 'Completed',
        orderDate: new Date(),
        items: {
          create: [{ productId: product.id, productName: 'Test Product', price: 500, quantity: 1 }]
        }
      }
    });
  });

  describe('GET /api/analytics/dashboard', () => {
    it('returns dashboard summary', async () => {
      const res = await request(app).get('/api/analytics/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.totalProducts).toBeDefined();
      expect(res.body.totalOrders).toBeDefined();
      expect(res.body.totalRevenue).toBeDefined();
    });
  });

  describe('GET /api/analytics/sales', () => {
    it('returns sales by period', async () => {
      const res = await request(app).get('/api/analytics/sales?period=monthly');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/analytics/top-products', () => {
    it('returns top products', async () => {
      const res = await request(app).get('/api/analytics/top-products?limit=5');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/analytics/revenue', () => {
    it('returns revenue by category', async () => {
      const res = await request(app).get('/api/analytics/revenue');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
