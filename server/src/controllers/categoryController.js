class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  async getAll(req, res, next) {
    try {
      const categories = await this.categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const category = await this.categoryService.updateCategory(parseInt(req.params.id), req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.categoryService.deleteCategory(parseInt(req.params.id));
      res.json({ message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
