// OrderService: business logic for orders
// Receives order and product repositories via constructor injection (DI pattern)
class OrderService {
  constructor(orderRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  // Get orders with filters, sorting, and pagination
  async getOrders(filters, sort, pagination) {
    return this.orderRepository.findAll(filters, sort, pagination);
  }

  // Get single order, throw 404 if not found
  async getOrderById(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }
    return order;
  }

  // Create order with auto-generated order ID and stock update
  async createOrder(data) {
    const { items, ...orderData } = data;

    // Generate order ID (ORD-001, ORD-002, etc.)
    const count = await this.orderRepository.count();
    const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;

    // Create order with items
    const order = await this.orderRepository.create({
      id: orderId,
      ...orderData,
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

    // Update product stock (decrement)
    for (const item of items) {
      await this.productRepository.update(item.productId, {
        stock: { decrement: item.quantity }
      });
    }

    return order;
  }

  // Update order status (verify order exists first)
  async updateOrderStatus(id, status) {
    await this.getOrderById(id);
    return this.orderRepository.updateStatus(id, status);
  }
}

module.exports = OrderService;
