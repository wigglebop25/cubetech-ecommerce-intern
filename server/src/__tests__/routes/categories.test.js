const request = require('supertest');
const express = require('express');
const categoryRoutes = require('../../routes/categories');
const authRoutes = require('../../routes/auth');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');
const argon2 = require('argon2');

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Category Routes', () => {
  let adminToken;

  beforeEach(async () => {
    // Create admin user and get token
    const hashedPassword = await argon2.hash('admin123');
    await prisma.adminUser.create({
      data: { username: 'admin', password: hashedPassword, role: 'admin' }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    adminToken = loginRes.body.accessToken;
  });

  describe('GET /api/categories', () => {
    it('returns empty array when no categories exist', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns categories with product count', async () => {
      const category = await prisma.category.create({
        data: { name: 'Clothing', description: 'Apparel' }
      });
      await prisma.product.create({
        data: { name: 'T-Shirt', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });

      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]._count.products).toBe(1);
    });
  });

  describe('POST /api/categories', () => {
    it('creates a new category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Electronics', description: 'Gadgets' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Electronics');
    });

    it('rejects duplicate category name', async () => {
      await prisma.category.create({
        data: { name: 'Clothing', description: 'Apparel' }
      });

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Clothing', description: 'Duplicate' });

      expect(res.status).toBe(500);
    });

    it('returns 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/categories')
        .send({ name: 'Test', description: 'Test' });

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('updates a category', async () => {
      const category = await prisma.category.create({
        data: { name: 'Old Name', description: 'Old desc' }
      });

      const res = await request(app)
        .put(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name', description: 'New desc' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New Name');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('deletes an empty category', async () => {
      const category = await prisma.category.create({
        data: { name: 'To Delete', description: 'Will be deleted' }
      });

      const res = await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Category deleted');
    });

    it('blocks deletion if products exist', async () => {
      const category = await prisma.category.create({
        data: { name: 'Has Products', description: 'Cannot delete' }
      });
      await prisma.product.create({
        data: { name: 'Product', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });

      const res = await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Cannot delete category');
    });
  });
});
