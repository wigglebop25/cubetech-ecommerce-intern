const request = require('supertest');
const express = require('express');
const healthRoutes = require('../../routes/health');

const app = express();
app.use(express.json());
app.use('/api/health', healthRoutes);

describe('Health Routes', () => {
  describe('GET /api/health', () => {
    it('returns status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
