// CustomerAuthController: handles HTTP requests/responses for customer authentication
// Receives service via constructor injection (DI pattern)
class CustomerAuthController {
  constructor(customerAuthService) {
    this.customerAuthService = customerAuthService;
  }

  // POST /api/customers/register - register new customer
  async register(req, res, next) {
    try {
      const result = await this.customerAuthService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/customers/login - customer login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.customerAuthService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/customers/profile - get customer profile (protected)
  async getProfile(req, res, next) {
    try {
      const profile = await this.customerAuthService.getProfile(req.customer.id);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/customers/profile - update customer profile (protected)
  async updateProfile(req, res, next) {
    try {
      const profile = await this.customerAuthService.updateProfile(req.customer.id, req.body);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/customers/address - update customer address (protected)
  async updateAddress(req, res, next) {
    try {
      const customer = await this.customerAuthService.updateAddress(req.customer.id, req.body);
      res.json({ message: 'Address updated', customer });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerAuthController;
