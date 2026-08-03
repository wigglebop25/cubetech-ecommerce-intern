const request = require('supertest');
const express = require('express');
const productRoutes = require('../../routes/products');
const authRoutes = require('../../routes/auth');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');
const argon2 = require('argon2');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Bulk Operations', () => {
  let adminToken;
  let category;

  beforeEach(async () => {
    category = await prisma.category.create({
      data: { name: 'Test Category', description: 'Test' }
    });

    const hashedPassword = await argon2.hash('admin123');
    await prisma.adminUser.create({
      data: { username: 'admin', password: hashedPassword, role: 'admin' }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = loginRes.body.accessToken;
  });

  describe('POST /api/products/bulk', () => {
    it('bulk creates products', async () => {
      const res = await request(app)
        .post('/api/products/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send([
          { name: 'Product 1', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 },
          { name: 'Product 2', image: 'img.jpg', categoryId: category.id, price: 200, stock: 20 }
        ]);

      expect(res.status).toBe(201);
      expect(res.body.message).toContain('2 products created');
    });

    it('requires authentication', async () => {
      const res = await request(app)
        .post('/api/products/bulk')
        .send([{ name: 'Test', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }]);

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/products/bulk', () => {
    it('bulk deletes products', async () => {
      const p1 = await prisma.product.create({
        data: { name: 'Delete 1', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });
      const p2 = await prisma.product.create({
        data: { name: 'Delete 2', image: 'img.jpg', categoryId: category.id, price: 200, stock: 20 }
      });

      const res = await request(app)
        .delete('/api/products/bulk')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ids: [p1.id, p2.id] });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('2 products deleted');
    });
  });
});
