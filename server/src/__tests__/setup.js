const { prisma } = require('../db');

// Clean up database before each test
// Delete in order to respect foreign key constraints
beforeEach(async () => {
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.adminUser.deleteMany();
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
