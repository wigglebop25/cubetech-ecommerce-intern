const { paginate, getPaginationMeta } = require('../utils/pagination');
const { parseSort } = require('../utils/sorting');
const { buildOrderFilters } = require('../utils/filtering');
const { toCSV, toJSON } = require('../utils/export');

// OrderController: handles HTTP requests/responses for orders
// Receives service via constructor injection (DI pattern)
class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  // GET /api/orders - list all orders with filters, sorting, pagination
  async getAll(req, res, next) {
    try {
      const { page, limit, sort, ...query } = req.query;
      
      const filters = buildOrderFilters(query);
      const orderBy = parseSort(sort);
      const pagination = paginate(page, limit);
      
      const { orders, total } = await this.orderService.getOrders(filters, orderBy, pagination);
      const paginationMeta = getPaginationMeta(total, page, limit);
      
      res.json({ data: orders, pagination: paginationMeta });
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

  // PUT /api/orders/:id/cancel - cancel order
  async cancelOrder(req, res, next) {
    try {
      const order = await this.orderService.updateOrderStatus(req.params.id, 'Cancelled', req.body?.notes || '');
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/orders/export - export orders to CSV or JSON
  async export(req, res, next) {
    try {
      const { format = 'csv', ...query } = req.query;
      const filters = buildOrderFilters(query);
      
      const { orders } = await this.orderService.getOrders(filters, {}, {});
      
      const columns = ['id', 'customerName', 'email', 'phone', 'total', 'paymentMethod', 'status', 'orderDate'];
      const exportData = orders.map(o => ({
        id: o.id,
        customerName: o.customerName,
        email: o.email,
        phone: o.phone,
        total: o.total,
        paymentMethod: o.paymentMethod,
        status: o.status,
        orderDate: new Date(o.orderDate).toLocaleString('en-PH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }));
      
      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.json');
        res.send(toJSON(exportData));
      } else {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
        res.send(toCSV(exportData, columns));
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
