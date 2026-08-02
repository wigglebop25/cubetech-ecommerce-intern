class CategoryService {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getCategories() {
    return this.categoryRepository.findAll();
  }

  async createCategory(data) {
    return this.categoryRepository.create(data);
  }

  async updateCategory(id, data) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.status = 404;
      throw error;
    }

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
