// CustomerController: handles HTTP requests/responses for customers
// Receives service via constructor injection (DI pattern)
class CustomerController {
  constructor(customerService) {
    this.customerService = customerService;
  }

  // GET /api/customers - list all customers (derived from orders)
  async getAll(req, res, next) {
    try {
      const customers = await this.customerService.getCustomers();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerController;
