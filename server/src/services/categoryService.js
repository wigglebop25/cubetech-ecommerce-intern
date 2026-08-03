// CategoryService: business logic for categories
// Receives repository via constructor injection (DI pattern)
class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  // Get all categories
  async getCategories() {
    return this.categoryRepository.findAll();
  }

  // Create new category
  async createCategory(data) {
    return this.categoryRepository.create(data);
  }

  // Update category (verify it exists first)
  async updateCategory(id, data) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return this.categoryRepository.update(id, data);
  }

  // Delete category with deletion guard
  // Prevents deletion if category has products assigned
  async deleteCategory(id) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

    // Check if category has products
    const productCount = await this.categoryRepository.getProductCount(id);
    if (productCount > 0) {
      const error = new Error(`Cannot delete category with ${productCount} product(s). Remove or reassign products first.`);
      error.status = 400;
      throw error;
    }

    return this.categoryRepository.delete(id);
  }
}

module.exports = CategoryService;
