const request = require('supertest');
const express = require('express');
const productRoutes = require('../../routes/products');
const orderRoutes = require('../../routes/orders');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);

describe('Export Routes', () => {
  beforeEach(async () => {
    const category = await prisma.category.create({
      data: { name: 'Test Category', description: 'Test' }
    });
    await prisma.product.create({
      data: { name: 'Export Product', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
    });
  });

  describe('GET /api/products/export', () => {
    it('exports products as CSV', async () => {
      const res = await request(app).get('/api/products/export?format=csv');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Export Product');
    });

    it('exports products as JSON', async () => {
      const res = await request(app).get('/api/products/export?format=json');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
      const data = JSON.parse(res.text);
      expect(data.length).toBeGreaterThan(0);
    });
  });
});
