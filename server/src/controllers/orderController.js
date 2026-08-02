class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  async getAll(req, res, next) {
    try {
      const { status, search } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (search) {
        filters.OR = [
          { id: { contains: search } },
          { customerName: { contains: search } }
        ];
      }

      const orders = await this.orderService.getOrders(filters);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const order = await this.orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
