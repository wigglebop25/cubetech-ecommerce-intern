// CategoryController: handles HTTP requests/responses for categories
// Receives service via constructor injection (DI pattern)
class CategoryController {
  constructor(categoryService) {
    this.categoryService = categoryService;
  }

  // GET /api/categories - list all categories
  async getAll(req, res, next) {
    try {
      const categories = await this.categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/categories - create new category
  async create(req, res, next) {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/categories/:id - update category
  async update(req, res, next) {
    try {
      const category = await this.categoryService.updateCategory(parseInt(req.params.id), req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/categories/:id - delete category
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
