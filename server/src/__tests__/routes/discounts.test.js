const request = require('supertest');
const express = require('express');
const discountRoutes = require('../../routes/discounts');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/discounts', discountRoutes);
app.use(errorHandler);

describe('Discount Routes', () => {
  describe('GET /api/discounts', () => {
    it('returns empty array when no discounts exist', async () => {
      const res = await request(app).get('/api/discounts');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns all discounts', async () => {
      await prisma.discount.create({
        data: { code: 'TEST10', type: 'percentage', value: 10, isActive: true }
      });

      const res = await request(app).get('/api/discounts');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].code).toBe('TEST10');
    });
  });

  describe('POST /api/discounts', () => {
    it('creates a new discount', async () => {
      const res = await request(app)
        .post('/api/discounts')
        .send({
          code: 'SAVE20',
          type: 'percentage',
          value: 20,
          minOrder: 500,
          maxUses: 100,
          isActive: true
        });

      expect(res.status).toBe(201);
      expect(res.body.code).toBe('SAVE20');
      expect(res.body.type).toBe('percentage');
    });

    it('rejects duplicate code', async () => {
      await prisma.discount.create({
        data: { code: 'DUPLICATE', type: 'fixed', value: 50, isActive: true }
      });

      const res = await request(app)
        .post('/api/discounts')
        .send({ code: 'DUPLICATE', type: 'fixed', value: 50 });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('PUT /api/discounts/:id', () => {
    it('updates a discount', async () => {
      const discount = await prisma.discount.create({
        data: { code: 'OLD', type: 'fixed', value: 50, isActive: true }
      });

      const res = await request(app)
        .put(`/api/discounts/${discount.id}`)
        .send({ code: 'NEW', value: 100 });

      expect(res.status).toBe(200);
      expect(res.body.code).toBe('NEW');
    });
  });

  describe('DELETE /api/discounts/:id', () => {
    it('deletes a discount', async () => {
      const discount = await prisma.discount.create({
        data: { code: 'DELETE', type: 'fixed', value: 50, isActive: true }
      });

      const res = await request(app).delete(`/api/discounts/${discount.id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Discount deleted');
    });
  });

  describe('POST /api/discounts/validate', () => {
    beforeEach(async () => {
      await prisma.discount.create({
        data: {
          code: 'VALID',
          type: 'percentage',
          value: 10,
          minOrder: 500,
          maxUses: 100,
          usedCount: 0,
          isActive: true
        }
      });
    });

    it('validates a discount code', async () => {
      const res = await request(app)
        .post('/api/discounts/validate')
        .send({ code: 'VALID', orderTotal: 1000 });

      expect(res.status).toBe(200);
      expect(res.body.discountAmount).toBe(100);
    });

    it('rejects invalid code', async () => {
      const res = await request(app)
        .post('/api/discounts/validate')
        .send({ code: 'INVALID', orderTotal: 1000 });

      expect(res.status).toBe(400);
    });

    it('rejects min order not met', async () => {
      const res = await request(app)
        .post('/api/discounts/validate')
        .send({ code: 'VALID', orderTotal: 100 });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Minimum order amount');
    });
  });
});
