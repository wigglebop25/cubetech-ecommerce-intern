const { prisma } = require('../db');

class AdminRepository {
  async findByUsername(username) {
    return prisma.adminUser.findUnique({ where: { username } });
  }

  async create(data) {
    return prisma.adminUser.create({ data });
  }
}

module.exports = new AdminRepository();
