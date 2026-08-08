import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton';
import { formatCurrency } from '../../utils/formatters';
import { IoCreate, IoTrash, IoAdd } from 'react-icons/io5';
import CustomDatePicker from '../../components/ui/DatePicker';

const emptyDiscount = {
  code: '',
  type: 'percentage',
  value: '',
  minOrder: '',
  maxUses: '',
  isActive: true,
  expiresAt: ''
};

export default function DiscountManagement() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState(emptyDiscount);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const data = await api.getDiscounts();
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingDiscount(null);
    setFormData(emptyDiscount);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value.toString(),
      minOrder: discount.minOrder?.toString() || '',
      maxUses: discount.maxUses?.toString() || '',
      isActive: discount.isActive,
      expiresAt: discount.expiresAt ? new Date(discount.expiresAt).toISOString().split('T')[0] : ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = 'Code is required';
    if (!formData.value || parseFloat(formData.value) <= 0) errors.value = 'Value must be greater than 0';
    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
      errors.value = 'Percentage cannot exceed 100';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = {
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: parseFloat(formData.value),
        minOrder: formData.minOrder ? parseFloat(formData.minOrder) : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        isActive: formData.isActive,
        expiresAt: formData.expiresAt || null
      };

      if (editingDiscount) {
        await api.updateDiscount(editingDiscount.id, data);
      } else {
        await api.createDiscount(data);
      }
      await fetchDiscounts();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving discount:', error);
      setFormErrors({ submit: error.message || 'Failed to save discount' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.deleteDiscount(deleteConfirm.id);
      await fetchDiscounts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const handleToggleActive = async (discount) => {
    try {
      await api.updateDiscount(discount.id, { isActive: !discount.isActive });
      await fetchDiscounts();
    } catch (error) {
      console.error('Error toggling discount status:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
        </div>
        <SkeletonTable rows={5} cols={7} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Discount Management</h1>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <IoAdd size={18} />
          Add Discount
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Min Order</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Uses</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {discounts.map(discount => (
                <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-medium text-blue-600 dark:text-blue-400">{discount.code}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {discount.type === 'percentage' ? 'Percentage' : 'Fixed'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                    {discount.minOrder ? formatCurrency(discount.minOrder) : 'None'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hidden lg:table-cell">
                    {discount.usedCount}/{discount.maxUses || '∞'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(discount)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        discount.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                    >
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(discount)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded cursor-pointer"
                      >
                        <IoCreate size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(discount)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                      >
                        <IoTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {discounts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No discounts found</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingDiscount ? 'Edit Discount' : 'Add Discount'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {formErrors.submit}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${formErrors.code ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              placeholder="e.g., WELCOME10"
            />
            {formErrors.code && <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₱)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value *</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 ${formErrors.value ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder={formData.type === 'percentage' ? '10' : '100'}
                min="0"
                step={formData.type === 'percentage' ? '1' : '0.01'}
              />
              {formErrors.value && <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Order (₱)</label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Uses</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                placeholder="100"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expires At</label>
            <CustomDatePicker
              value={formData.expiresAt}
              onChange={(val) => setFormData({ ...formData, expiresAt: val })}
              placeholder="Select expiry date"
              minDate={new Date()}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingDiscount ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Discount"
        message={`Are you sure you want to delete discount code "${deleteConfirm?.code}"? This action cannot be undone.`}
      />
    </div>
  );
}
