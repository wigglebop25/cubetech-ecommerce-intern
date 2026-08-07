class CustomerOrderController {
  constructor(customerOrderService) {
    this.customerOrderService = customerOrderService;
    this.getOrders = this.getOrders.bind(this);
    this.getOrder = this.getOrder.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }

  async getOrders(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await this.customerOrderService.getCustomerOrders(
        req.customer.email, parseInt(page), parseInt(limit)
      );
      res.json(result);
    } catch (error) { next(error); }
  }

  async getOrder(req, res, next) {
    try {
      const order = await this.customerOrderService.getCustomerOrder(
        req.params.id, req.customer.email
      );
      res.json(order);
    } catch (error) { next(error); }
  }

  async cancelOrder(req, res, next) {
    try {
      const order = await this.customerOrderService.cancelOrder(
        req.params.id, req.customer.email
      );
      res.json(order);
    } catch (error) { next(error); }
  }
}

module.exports = CustomerOrderController;
