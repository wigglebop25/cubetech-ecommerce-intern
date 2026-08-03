const { prisma } = require('../db');

// OrderService: business logic for orders
// Receives repositories via constructor injection (DI pattern)
class OrderService {
  constructor(orderRepository, productRepository, orderStatusRepository, discountService) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.orderStatusRepository = orderStatusRepository;
    this.discountService = discountService;
  }

  // Get orders with filters, sorting, and pagination
  async getOrders(filters, sort, pagination) {
    return this.orderRepository.findAll(filters, sort, pagination);
  }

  // Get single order with status history
  async getOrderById(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }

    // Get status history
    const statusHistory = await this.orderStatusRepository.findByOrderId(id);
    return { ...order, statusHistory };
  }

  // Create order with auto-generated order ID and stock update
  async createOrder(data) {
    const { items, discountCode, ...orderData } = data;

    // Generate order ID (ORD-001, ORD-002, etc.)
    const count = await this.orderRepository.count();
    const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Apply discount if provided
    let discountAmount = 0;
    let discountId = null;
    if (discountCode) {
      const discountResult = await this.discountService.validateDiscount(discountCode, subtotal);
      discountAmount = discountResult.discountAmount;
      discountId = discountResult.discountId;
      await this.discountService.applyDiscount(discountId);
    }

    // Calculate tax (12% VAT)
    const tax = (subtotal - discountAmount) * 0.12;

    // Calculate shipping
    const shippingCost = subtotal >= 2000 ? 0 : subtotal >= 1000 ? 99 : 149;

    // Calculate total
    const total = (subtotal - discountAmount) + tax + shippingCost;

    // Create order with items
    const order = await this.orderRepository.create({
      id: orderId,
      ...orderData,
      subtotal,
      tax,
      shippingCost,
      total,
      discountId,
      orderDate: new Date(),
      items: {
        create: items.map(item => ({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      }
    });

    // Create initial status history
    await this.orderStatusRepository.create(orderId, 'Pending', 'Order placed');

    // Update product stock (decrement)
    for (const item of items) {
      await this.productRepository.update(item.productId, {
        stock: { decrement: item.quantity }
      });
    }

    return order;
  }

  // Update order status with history tracking
  async updateOrderStatus(id, status, notes = '') {
    await this.getOrderById(id);

    // Update order status
    const order = await this.orderRepository.updateStatus(id, status);

    // Add to status history
    await this.orderStatusRepository.create(id, status, notes);

    // If cancelled, restore stock
    if (status === 'Cancelled') {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: id }
      });

      for (const item of orderItems) {
        await this.productRepository.update(item.productId, {
          stock: { increment: item.quantity }
        });
      }
    }

    return order;
  }

  // Get order status history
  async getOrderStatusHistory(orderId) {
    return this.orderStatusRepository.findByOrderId(orderId);
  }
}

module.exports = OrderService;
