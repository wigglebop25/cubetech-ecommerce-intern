class CustomerService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async getCustomers() {
    const orders = await this.orderRepository.findAll();

    const customerMap = {};
    orders.forEach(order => {
      if (!customerMap[order.email]) {
        customerMap[order.email] = {
          name: order.customerName,
          email: order.email,
          phone: order.phone,
          orderCount: 0,
          totalSpent: 0,
          status: 'Active'
        };
      }
      customerMap[order.email].orderCount += 1;
      customerMap[order.email].totalSpent += parseFloat(order.total);
    });

    return Object.values(customerMap);
  }
}

module.exports = CustomerService;
