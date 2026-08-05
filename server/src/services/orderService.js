const { prisma } = require('../db');
const emailService = require('./emailService');

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

    // Note: Stock is NOT decremented on order creation
    // Stock is decremented when order status changes to "Confirmed"

    // Send order confirmation email
    await emailService.sendOrderConfirmation(order);

    return order;
  }

  // Update order status with history tracking
  async updateOrderStatus(id, status, notes = '') {
    const existingOrder = await this.getOrderById(id);
    const oldStatus = existingOrder.status;

    // Define status order (forward only)
    const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed'];
    const oldIndex = statusOrder.indexOf(oldStatus);
    const newIndex = statusOrder.indexOf(status);

    // Allow Cancel from Pending, Confirmed, Preparing only
    if (status === 'Cancelled') {
      if (!['Pending', 'Confirmed', 'Preparing'].includes(oldStatus)) {
        const error = new Error(`Cannot cancel order with status ${oldStatus}`);
        error.status = 400;
        throw error;
      }
    } else if (newIndex < oldIndex) {
      // Prevent backward status changes
      const error = new Error(`Cannot change status from ${oldStatus} to ${status}. Forward only.`);
      error.status = 400;
      throw error;
    }

    // Update order status
    const order = await this.orderRepository.updateStatus(id, status);

    // Add to status history
    await this.orderStatusRepository.create(id, status, notes);

    // If confirmed, decrement stock
    if (status === 'Confirmed' && oldStatus !== 'Confirmed') {
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: id }
      });

      for (const item of orderItems) {
        await this.productRepository.update(item.productId, {
          stock: { decrement: item.quantity }
        });
      }
    }

    // Get order items for email
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: id }
    });

    // Build order object with items for email
    const orderWithItems = { ...order, items: orderItems };

    // If cancelled, restore stock and send cancellation email
    if (status === 'Cancelled') {
      // Only restore stock if it was previously decremented (status was Confirmed or later)
      if (['Confirmed', 'Preparing', 'Shipped'].includes(oldStatus)) {
        for (const item of orderItems) {
          await this.productRepository.update(item.productId, {
            stock: { increment: item.quantity }
          });
        }
      }

      await emailService.sendOrderCancelled(orderWithItems);
    } else {
      // Send status update email with items
      await emailService.sendStatusUpdate(orderWithItems, status);
    }

    return order;
  }

  // Get order status history
  async getOrderStatusHistory(orderId) {
    return this.orderStatusRepository.findByOrderId(orderId);
  }
}

module.exports = OrderService;
