const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../routes/orders');
const authRoutes = require('../../routes/auth');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');
const argon2 = require('argon2');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Order Routes', () => {
  let product;
  let adminToken;

  beforeEach(async () => {
    // Create category and product
    const category = await prisma.category.create({
      data: { name: 'Clothing', description: 'Apparel' }
    });
    product = await prisma.product.create({
      data: { name: 'T-Shirt', image: 'img.jpg', categoryId: category.id, price: 500, stock: 50 }
    });

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

  describe('GET /api/orders', () => {
    it('returns empty array when no orders exist', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.totalItems).toBe(0);
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

      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].items).toHaveLength(1);
      expect(res.body.pagination.totalItems).toBe(1);
    });

    it('paginates results', async () => {
      // Create 5 orders
      for (let i = 1; i <= 5; i++) {
        await prisma.order.create({
          data: {
            id: `ORD-${String(i).padStart(3, '0')}`,
            customerName: `Customer ${i}`,
            email: `customer${i}@test.com`,
            phone: '09171234567',
            address: '123 Main St',
            subtotal: 500,
            total: 500,
            paymentMethod: 'Cash on Delivery',
            status: 'Pending',
            orderDate: new Date()
          }
        });
      }

      const res = await request(app)
        .get('/api/orders?page=1&limit=2')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination.totalItems).toBe(5);
      expect(res.body.pagination.totalPages).toBe(3);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });

    it('filters by status', async () => {
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
      await prisma.order.create({
        data: {
          id: 'ORD-002',
          customerName: 'Maria',
          email: 'maria@test.com',
          phone: '09181234567',
          address: '456 Rizal Ave',
          subtotal: 1000,
          total: 1000,
          paymentMethod: 'E-Wallet',
          status: 'Completed',
          orderDate: new Date()
        }
      });

      const res = await request(app)
        .get('/api/orders?status=Pending')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('Pending');
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

      const res = await request(app)
        .get('/api/orders/ORD-001')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.customerName).toBe('Juan');
    });

    it('returns 404 for non-existent order', async () => {
      const res = await request(app)
        .get('/api/orders/ORD-999')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/orders', () => {
    it('creates a new order without decrementing stock', async () => {
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

      // Stock should NOT be decremented on order creation
      const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } });
      expect(updatedProduct.stock).toBe(50); // Original stock
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
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Confirmed' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Confirmed');
    });

    it('decrements stock when order is confirmed', async () => {
      // Create order
      const orderRes = await request(app)
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

      // Stock should be 50 (not decremented)
      const beforeConfirm = await prisma.product.findUnique({ where: { id: product.id } });
      expect(beforeConfirm.stock).toBe(50);

      // Confirm the order
      await request(app)
        .put(`/api/orders/${orderRes.body.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Confirmed' });

      // Stock should now be 48 (decremented by 2)
      const afterConfirm = await prisma.product.findUnique({ where: { id: product.id } });
      expect(afterConfirm.stock).toBe(48);
    }, 10000);
  });
});
