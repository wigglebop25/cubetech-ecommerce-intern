const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../routes/orders');
const { prisma } = require('../../db');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);

describe('Order Routes', () => {
  let product;

  beforeEach(async () => {
    const category = await prisma.category.create({
      data: { name: 'Clothing', description: 'Apparel' }
    });
    product = await prisma.product.create({
      data: { name: 'T-Shirt', image: 'img.jpg', categoryId: category.id, price: 500, stock: 50 }
    });
  });

  describe('GET /api/orders', () => {
    it('returns empty array when no orders exist', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns orders with items', async () => {
      await prisma.order.create({
        data: {
          id: 'ORD-001',
          customerName: 'Juan',
          email: 'juan@test.com',
          phone: '09171234567',
          address: '123 Main St',
          subtotal: 500,
          total: 500,
          paymentMethod: 'Cash on Delivery',
          status: 'Pending',
          orderDate: new Date(),
          items: {
            create: [{ productId: product.id, productName: 'T-Shirt', price: 500, quantity: 1 }]
          }
        }
      });

      const res = await request(app).get('/api/orders');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].items).toHaveLength(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('returns a single order', async () => {
      await prisma.order.create({
        data: {
          id: 'ORD-001',
          customerName: 'Juan',
          email: 'juan@test.com',
          phone: '09171234567',
          address: '123 Main St',
          subtotal: 500,
          total: 500,
          paymentMethod: 'Cash on Delivery',
          status: 'Pending',
          orderDate: new Date(),
          items: {
            create: [{ productId: product.id, productName: 'T-Shirt', price: 500, quantity: 1 }]
          }
        }
      });

      const res = await request(app).get('/api/orders/ORD-001');
      expect(res.status).toBe(200);
      expect(res.body.customerName).toBe('Juan');
    });

    it('returns 404 for non-existent order', async () => {
      const res = await request(app).get('/api/orders/ORD-999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/orders', () => {
    it('creates a new order and updates stock', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'Maria',
          email: 'maria@test.com',
          phone: '09181234567',
          address: '456 Rizal Ave',
          items: [{ productId: product.id, name: 'T-Shirt', price: 500, quantity: 2 }],
          subtotal: 1000,
          total: 1000,
          paymentMethod: 'E-Wallet',
          notes: ''
        });

      expect(res.status).toBe(201);
      expect(res.body.customerName).toBe('Maria');

      // Check stock was decremented
      const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
      expect(updatedProduct.stock).toBe(48);
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('updates order status', async () => {
      await prisma.order.create({
        data: {
          id: 'ORD-001',
          customerName: 'Juan',
          email: 'juan@test.com',
          phone: '09171234567',
          address: '123 Main St',
          subtotal: 500,
          total: 500,
          paymentMethod: 'Cash on Delivery',
          status: 'Pending',
          orderDate: new Date()
        }
      });

      const res = await request(app)
        .put('/api/orders/ORD-001/status')
        .send({ status: 'Confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Confirmed');
    });
  });
});
