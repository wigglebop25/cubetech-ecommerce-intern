const { prisma } = require('../db');

// Clean up database before each test
beforeEach(async () => {
  // Delete in order to respect foreign key constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
