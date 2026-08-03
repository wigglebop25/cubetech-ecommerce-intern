// OrderController: handles HTTP requests/responses for orders
// Receives service via constructor injection (DI pattern)
class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  // GET /api/orders - list all orders with optional filters
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

  // GET /api/orders/:id - get single order
  async getById(req, res, next) {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/orders - create new order
  async create(req, res, next) {
    try {
      const order = await this.orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/orders/:id/status - update order status
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
