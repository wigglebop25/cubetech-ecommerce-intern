import { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/ui/SearchBar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { PRODUCT_STATUSES } from '../../utils/constants';
import { validateRequired, validatePositiveNumber } from '../../utils/validators';
import { useDebounce } from '../../hooks/useDebounce';
import { IoCreate, IoTrash } from 'react-icons/io5';

const emptyProduct = {
  name: '',
  image: '',
  category: '',
  description: '',
  price: '',
  stock: '',
  status: 'Active'
};

export default function ProductManagement() {
  const { products, categories, fetchProducts, fetchCategories, addProduct, updateProduct, deleteProduct } = useData();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (debouncedSearch) {
      result = result.filter(p => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    }
    if (filterCategory) {
      result = result.filter(p => p.category?.name === filterCategory);
    }
    if (filterStatus) {
      result = result.filter(p => p.status === filterStatus);
    }
    return result;
  }, [products, debouncedSearch, filterCategory, filterStatus]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: product.image || '',
      category: product.category?.name || '',
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Price must be greater than 0';
    if (formData.stock === '' || Number(formData.stock) < 0) errors.stock = 'Stock cannot be negative';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const productData = {
        name: formData.name,
        image: formData.image || 'https://via.placeholder.com/400',
        categoryId: categories.find(c => c.name === formData.category)?.id,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        status: formData.status
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      await deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Product Management</h1>
        <Button onClick={openAddModal}>Add Product</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">All Statuses</option>
          {PRODUCT_STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{product.category?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 dark:text-gray-200">{product.stock}</span>
                      {product.stock < 10 && product.stock > 0 && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stock < 3 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {product.stock < 3 ? 'Critical' : 'Low'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={product.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer">
                        <IoCreate size={18} />
                      </button>
                      <button onClick={() => setDeleteConfirm(product)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer">
                        <IoTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No products found</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${formErrors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${formErrors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
              {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock *</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${formErrors.stock ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`} />
              {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200">
              {PRODUCT_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingProduct ? 'Update' : 'Add'} Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
