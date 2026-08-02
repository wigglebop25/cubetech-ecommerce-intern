class CustomerController {
  constructor(customerService) {
    this.customerService = customerService;
  }

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
