const { prisma } = require('../db');

// AdminRepository: handles database operations for admin users
class AdminRepository {
  // Find admin by username (used for login)
  async findByUsername(username) {
    return prisma.adminUser.findUnique({ where: { username } });
  }

  // Create new admin user
  async create(data) {
    return prisma.adminUser.create({ data });
  }
}

module.exports = new AdminRepository();
