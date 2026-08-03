// DiscountService: business logic for discounts
// Receives repository via constructor injection (DI pattern)
class DiscountService {
  constructor(discountRepository) {
    this.discountRepository = discountRepository;
  }

  // Get all discounts
  async getDiscounts() {
    return this.discountRepository.findAll();
  }

  // Get discount by ID
  async getDiscountById(id) {
    const discount = await this.discountRepository.findById(id);
    if (!discount) {
      const error = new Error('Discount not found');
      error.status = 404;
      throw error;
    }
    return discount;
  }

  // Create discount with validation
  async createDiscount(data) {
    // Validate discount type
    if (!['percentage', 'fixed'].includes(data.type)) {
      const error = new Error('Discount type must be "percentage" or "fixed"');
      error.status = 400;
      throw error;
    }

    // Validate value
    if (data.value <= 0) {
      const error = new Error('Discount value must be greater than 0');
      error.status = 400;
      throw error;
    }

    // Check for duplicate code
    const existing = await this.discountRepository.findByCode(data.code);
    if (existing) {
      const error = new Error('Discount code already exists');
      error.status = 400;
      throw error;
    }

    return this.discountRepository.create(data);
  }

  // Update discount
  async updateDiscount(id, data) {
    await this.getDiscountById(id);
    return this.discountRepository.update(id, data);
  }

  // Delete discount
  async deleteDiscount(id) {
    await this.getDiscountById(id);
    return this.discountRepository.delete(id);
  }

  // Validate and apply discount
  async validateDiscount(code, orderTotal) {
    const discount = await this.discountRepository.findByCode(code);

    if (!discount) {
      const error = new Error('Invalid discount code');
      error.status = 400;
      throw error;
    }

    if (!discount.isActive) {
      const error = new Error('Discount code is no longer active');
      error.status = 400;
      throw error;
    }

    if (discount.expiresAt && new Date() > discount.expiresAt) {
      const error = new Error('Discount code has expired');
      error.status = 400;
      throw error;
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      const error = new Error('Discount code has reached maximum uses');
      error.status = 400;
      throw error;
    }

    if (discount.minOrder && orderTotal < discount.minOrder) {
      const error = new Error(`Minimum order amount is ${discount.minOrder}`);
      error.status = 400;
      throw error;
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (orderTotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    return {
      discountId: discount.id,
      discountCode: discount.code,
      discountAmount: Math.min(discountAmount, orderTotal),
      discountType: discount.type
    };
  }

  // Apply discount (increment usage)
  async applyDiscount(id) {
    return this.discountRepository.incrementUsedCount(id);
  }
}

module.exports = DiscountService;
