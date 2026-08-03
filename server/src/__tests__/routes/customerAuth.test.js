const request = require('supertest');
const express = require('express');
const customerRoutes = require('../../routes/customers');
const { prisma } = require('../../db');
const errorHandler = require('../../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/customers', customerRoutes);
app.use(errorHandler);

describe('Customer Auth Routes', () => {
  describe('POST /api/customers/register', () => {
    it('registers a new customer', async () => {
      const res = await request(app)
        .post('/api/customers/register')
        .send({
          name: 'Test Customer',
          email: 'test@example.com',
          password: 'password123',
          phone: '09171234567'
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Registration successful');
      expect(res.body.customer.name).toBe('Test Customer');
      expect(res.body.token).toBeDefined();
    });

    it('rejects duplicate email', async () => {
      await request(app)
        .post('/api/customers/register')
        .send({
          name: 'Customer 1',
          email: 'duplicate@example.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/customers/register')
        .send({
          name: 'Customer 2',
          email: 'duplicate@example.com',
          password: 'password456'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email already registered');
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post('/api/customers/register')
        .send({ name: 'Test' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name, email, and password are required');
    });
  });

  describe('POST /api/customers/login', () => {
    beforeEach(async () => {
      // Register a customer first
      await request(app)
        .post('/api/customers/register')
        .send({
          name: 'Login Test',
          email: 'login@example.com',
          password: 'password123'
        });
    });

    it('authenticates valid credentials', async () => {
      const res = await request(app)
        .post('/api/customers/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBeDefined();
    });

    it('rejects invalid password', async () => {
      const res = await request(app)
        .post('/api/customers/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('rejects non-existent email', async () => {
      const res = await request(app)
        .post('/api/customers/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('validates required fields', async () => {
      const res = await request(app)
        .post('/api/customers/login')
        .send({ email: 'login@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email and password are required');
    });
  });

  describe('GET /api/customers/profile', () => {
    let customerToken;

    beforeEach(async () => {
      const regRes = await request(app)
        .post('/api/customers/register')
        .send({
          name: 'Profile Test',
          email: 'profile@example.com',
          password: 'password123',
          phone: '09171234567'
        });
      customerToken = regRes.body.token;
    });

    it('returns customer profile', async () => {
      const res = await request(app)
        .get('/api/customers/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Profile Test');
      expect(res.body.email).toBe('profile@example.com');
    });

    it('requires authentication', async () => {
      const res = await request(app).get('/api/customers/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/customers/profile', () => {
    let customerToken;

    beforeEach(async () => {
      const regRes = await request(app)
        .post('/api/customers/register')
        .send({
          name: 'Update Test',
          email: 'update@example.com',
          password: 'password123'
        });
      customerToken = regRes.body.token;
    });

    it('updates customer profile', async () => {
      const res = await request(app)
        .put('/api/customers/profile')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Updated Name', phone: '09181234567' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
      expect(res.body.phone).toBe('09181234567');
    });
  });
});
