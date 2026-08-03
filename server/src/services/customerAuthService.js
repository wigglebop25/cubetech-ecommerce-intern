const argon2 = require('argon2');
const { generateCustomerToken } = require('../utils/customerJwt');

// CustomerAuthService: customer authentication logic
// Receives customer repository via constructor injection (DI pattern)
class CustomerAuthService {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  // Register new customer
  async register(data) {
    const { name, email, password, phone } = data;

    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error('Name, email, and password are required');
      error.status = 400;
      throw error;
    }

    // Check if email already exists
    const existing = await this.customerRepository.findByEmail(email);
    if (existing) {
      const error = new Error('Email already registered');
      error.status = 400;
      throw error;
    }

    // Hash password with Argon2
    const hashedPassword = await argon2.hash(password);

    // Create customer
    const customer = await this.customerRepository.create({
      name,
      email,
      password: hashedPassword,
      phone
    });

    // Generate JWT token
    const token = generateCustomerToken({
      id: customer.id,
      email: customer.email,
      role: 'customer'
    });

    return {
      message: 'Registration successful',
      customer: { id: customer.id, name: customer.name, email: customer.email },
      token
    };
  }

  // Login customer
  async login(email, password) {
    // Validate required fields
    if (!email || !password) {
      const error = new Error('Email and password are required');
      error.status = 400;
      throw error;
    }

    // Find customer by email
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Verify password with Argon2
    const validPassword = await argon2.verify(customer.password, password);
    if (!validPassword) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    // Generate JWT token
    const token = generateCustomerToken({
      id: customer.id,
      email: customer.email,
      role: 'customer'
    });

    return {
      message: 'Login successful',
      customer: { id: customer.id, name: customer.name, email: customer.email },
      token
    };
  }

  // Get customer profile
  async getProfile(id) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }

    // Don't return password
    const { password, ...profile } = customer;
    return profile;
  }

  // Update customer profile
  async updateProfile(id, data) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }

    // Don't allow password update through this method
    const { password, ...updateData } = data;

    const updated = await this.customerRepository.update(id, updateData);
    const { password: _, ...profile } = updated;
    return profile;
  }

  // Update customer address
  async updateAddress(id, addressData) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      const error = new Error('Customer not found');
      error.status = 404;
      throw error;
    }

    return this.customerRepository.update(id, addressData);
  }
}

module.exports = CustomerAuthService;
