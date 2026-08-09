const request = require('supertest');
const express = require('express');
const customerRoutes = require('../../routes/customers');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/customers', customerRoutes);
app.use(errorHandler);

describe('Customer Routes', () => {
  beforeEach(async () => {
    const category = await prisma.category.create({
      data: { name: 'Clothing', description: 'Apparel' }
    });
    const product = await prisma.product.create({
      data: { name: 'T-Shirt', image: 'img.jpg', categoryId: category.id, price: 500, stock: 50 }
    });

    // Create a customer in the Customer table
    await prisma.customer.create({
      data: {
        name: 'Juan Dela Cruz',
        email: 'juan@test.com',
        password: 'hashedpassword',
        phone: '09171234567'
      }
    });

    // Create an order for the customer
    await prisma.order.create({
      data: {
        id: 'ORD-001',
        customerName: 'Juan Dela Cruz',
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
  });

  describe('GET /api/customers', () => {
    it('returns all customers from Customer table with order stats', async () => {
      const res = await request(app).get('/api/customers');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Juan Dela Cruz');
      expect(res.body[0].email).toBe('juan@test.com');
      expect(res.body[0].orderCount).toBe(1);
      expect(res.body[0].totalSpent).toBe(500);
    });
  });
});
