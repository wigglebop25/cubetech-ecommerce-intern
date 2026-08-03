const request = require('supertest');
const express = require('express');
const wishlistRoutes = require('../../routes/wishlist');
const customerRoutes = require('../../routes/customers');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/customers', customerRoutes);
app.use(errorHandler);

describe('Wishlist Routes', () => {
  let customerToken;
  let product;

  beforeEach(async () => {
    // Create category and product
    const category = await prisma.category.create({
      data: { name: 'Test Category', description: 'Test' }
    });
    product = await prisma.product.create({
      data: { name: 'Test Product', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
    });

    // Register customer and get token
    const regRes = await request(app)
      .post('/api/customers/register')
      .send({
        name: 'Wishlist User',
        email: 'wishlist@test.com',
        password: 'password123'
      });
    customerToken = regRes.body.token;
  });

  describe('GET /api/wishlist', () => {
    it('returns empty wishlist', async () => {
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('requires authentication', async () => {
      const res = await request(app).get('/api/wishlist');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/wishlist', () => {
    it('adds product to wishlist', async () => {
      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: product.id });

      expect(res.status).toBe(201);
      expect(res.body.productId).toBe(product.id);
    });

    it('rejects duplicate product', async () => {
      await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: product.id });

      const res = await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: product.id });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Product already in wishlist');
    });
  });

  describe('DELETE /api/wishlist/:productId', () => {
    it('removes product from wishlist', async () => {
      await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: product.id });

      const res = await request(app)
        .delete(`/api/wishlist/${product.id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Removed from wishlist');
    });
  });

  describe('DELETE /api/wishlist', () => {
    it('clears wishlist', async () => {
      await request(app)
        .post('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ productId: product.id });

      const res = await request(app)
        .delete('/api/wishlist')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Wishlist cleared');
    });
  });
});
