const request = require('supertest');
const express = require('express');
const productRoutes = require('../../routes/products');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use(errorHandler);

describe('Product Routes', () => {
  let category;

  beforeEach(async () => {
    category = await prisma.category.create({
      data: { name: 'Clothing', description: 'Apparel' }
    });
  });

  describe('GET /api/products', () => {
    it('returns empty array when no products exist', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns all products', async () => {
      await prisma.product.create({
        data: {
          name: 'Test Product',
          image: 'test.jpg',
          categoryId: category.id,
          description: 'Test description',
          price: 100,
          stock: 10,
          status: 'Active'
        }
      });

      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Test Product');
    });

    it('filters by category', async () => {
      const category2 = await prisma.category.create({
        data: { name: 'Electronics', description: 'Gadgets' }
      });

      await prisma.product.create({
        data: { name: 'T-Shirt', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });
      await prisma.product.create({
        data: { name: 'Phone', image: 'img.jpg', categoryId: category2.id, price: 500, stock: 5 }
      });

      const res = await request(app).get('/api/products?category=Clothing');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('T-Shirt');
    });

    it('filters by status', async () => {
      await prisma.product.create({
        data: { name: 'Active Product', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10, status: 'Active' }
      });
      await prisma.product.create({
        data: { name: 'Inactive Product', image: 'img.jpg', categoryId: category.id, price: 100, stock: 0, status: 'Inactive' }
      });

      const res = await request(app).get('/api/products?status=Active');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Active Product');
    });

    it('searches by name', async () => {
      await prisma.product.create({
        data: { name: 'White T-Shirt', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });
      await prisma.product.create({
        data: { name: 'Blue Jeans', image: 'img.jpg', categoryId: category.id, price: 200, stock: 5 }
      });

      const res = await request(app).get('/api/products?search=shirt');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('White T-Shirt');
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns a single product', async () => {
      const product = await prisma.product.create({
        data: { name: 'Test Product', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });

      const res = await request(app).get(`/api/products/${product.id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test Product');
    });

    it('returns 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Product not found');
    });
  });

  describe('POST /api/products', () => {
    it('creates a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          image: 'img.jpg',
          categoryId: category.id,
          description: 'Description',
          price: 150,
          stock: 20,
          status: 'Active'
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('New Product');
      expect(res.body.price).toBe('150');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('updates a product', async () => {
      const product = await prisma.product.create({
        data: { name: 'Old Name', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });

      const res = await request(app)
        .put(`/api/products/${product.id}`)
        .send({ name: 'New Name', price: 200 });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('New Name');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('deletes a product', async () => {
      const product = await prisma.product.create({
        data: { name: 'To Delete', image: 'img.jpg', categoryId: category.id, price: 100, stock: 10 }
      });

      const res = await request(app).delete(`/api/products/${product.id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted');

      const found = await prisma.product.findUnique({ where: { id: product.id } });
      expect(found).toBeNull();
    });
  });
});
