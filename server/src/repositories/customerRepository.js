const { prisma } = require('../db');

// CustomerRepository: handles all database operations for customers
class CustomerRepository {
  // Find customer by email
  async findByEmail(email) {
    return prisma.customer.findUnique({ where: { email } });
  }

  // Find customer by ID
  async findById(id) {
    return prisma.customer.findUnique({ where: { id } });
  }

  // Create new customer
  async create(data) {
    return prisma.customer.create({ data });
  }

  // Update customer
  async update(id, data) {
    return prisma.customer.update({ where: { id }, data });
  }

  // Get all customers
  async findAll() {
    return prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = new CustomerRepository();
