const request = require('supertest');
const express = require('express');
const statsRoutes = require('../../routes/stats');
const { prisma } = require('../../db');
const argon2 = require('argon2');

const app = express();
app.use(express.json());
app.use('/api/stats', statsRoutes);

describe('Stats Routes', () => {
  beforeEach(async () => {
    const category = await prisma.category.create({
      data: { name: 'Clothing', description: 'Apparel' }
    });
    const product = await prisma.product.create({
      data: { name: 'T-Shirt', image: 'img.jpg', categoryId: category.id, price: 500, stock: 50 }
    });

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
        status: 'Completed',
        orderDate: new Date(),
        items: { create: [{ productId: product.id, productName: 'T-Shirt', price: 500, quantity: 1 }] }
      }
    });

    await prisma.order.create({
      data: {
        id: 'ORD-002',
        customerName: 'Maria',
        email: 'maria@test.com',
        phone: '09181234567',
        address: '456 Rizal Ave',
        subtotal: 300,
        total: 300,
        paymentMethod: 'E-Wallet',
        status: 'Pending',
        orderDate: new Date()
      }
    });
  });

  describe('GET /api/stats', () => {
    it('returns correct dashboard statistics', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.status).toBe(200);
      expect(res.body.totalProducts).toBe(1);
      expect(res.body.totalOrders).toBe(2);
      expect(res.body.pendingOrders).toBe(1);
      expect(res.body.completedOrders).toBe(1);
      expect(res.body.totalCustomers).toBe(2);
      expect(res.body.totalSales).toBe(500);
    });
  });
});
