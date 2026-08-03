// DiscountController: handles HTTP requests/responses for discounts
// Receives service via constructor injection (DI pattern)
class DiscountController {
  constructor(discountService) {
    this.discountService = discountService;
  }

  // GET /api/discounts - list all discounts
  async getAll(req, res, next) {
    try {
      const discounts = await this.discountService.getDiscounts();
      res.json(discounts);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/discounts/:id - get single discount
  async getById(req, res, next) {
    try {
      const discount = await this.discountService.getDiscountById(parseInt(req.params.id));
      res.json(discount);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/discounts - create new discount
  async create(req, res, next) {
    try {
      const discount = await this.discountService.createDiscount(req.body);
      res.status(201).json(discount);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/discounts/:id - update discount
  async update(req, res, next) {
    try {
      const discount = await this.discountService.updateDiscount(parseInt(req.params.id), req.body);
      res.json(discount);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/discounts/:id - delete discount
  async delete(req, res, next) {
    try {
      await this.discountService.deleteDiscount(parseInt(req.params.id));
      res.json({ message: 'Discount deleted' });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/discounts/validate - validate discount code
  async validate(req, res, next) {
    try {
      const { code, orderTotal } = req.body;
      const result = await this.discountService.validateDiscount(code, orderTotal);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DiscountController;
