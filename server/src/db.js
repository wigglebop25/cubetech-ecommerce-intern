const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

// Prisma client singleton - used by all repositories
const prisma = new PrismaClient();

module.exports = { prisma };
