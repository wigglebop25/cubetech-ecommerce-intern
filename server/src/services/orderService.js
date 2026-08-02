class OrderService {
  constructor(orderRepository, productRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async getOrders(filters) {
    return this.orderRepository.findAll(filters);
  }

  async getOrderById(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      const error = new Error('Order not found');
      error.status = 404;
      throw error;
    }
    return order;
  }

  async createOrder(data) {
    const { items, ...orderData } = data;

    const count = await this.orderRepository.count();
    const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;

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

    for (const item of items) {
      await this.productRepository.update(item.productId, {
        stock: { decrement: item.quantity }
      });
    }

    return order;
  }

  async updateOrderStatus(id, status) {
    await this.getOrderById(id);
    return this.orderRepository.updateStatus(id, status);
  }
}

module.exports = OrderService;
