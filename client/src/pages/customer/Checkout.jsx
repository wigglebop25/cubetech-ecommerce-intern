import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validators';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: PAYMENT_METHODS[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Discount state
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountId, setDiscountId] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountRemainingUses, setDiscountRemainingUses] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const nameError = validateRequired(formData.customerName, 'Customer Name');
    if (nameError) newErrors.customerName = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const addressError = validateRequired(formData.address, 'Delivery Address');
    if (addressError) newErrors.address = addressError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    setApplyingDiscount(true);
    setDiscountError('');

    try {
      const result = await api.validateDiscount(discountCode.trim(), cartTotal);
      setDiscountAmount(result.discountAmount);
      setDiscountId(result.discountId);
      setDiscountRemainingUses(result.remainingUses);
      setDiscountError('');
    } catch (error) {
      setDiscountError(error.message || 'Invalid discount code');
      setDiscountAmount(0);
      setDiscountId(null);
      setDiscountRemainingUses(null);
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setDiscountAmount(0);
    setDiscountId(null);
    setDiscountRemainingUses(null);
    setDiscountError('');
  };

  const finalTotal = cartTotal - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    if (cartItems.length === 0) return;

    setSubmitting(true);
    try {
      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: cartTotal,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        discountCode: discountCode || undefined
      };

      const order = await api.createOrder(orderData);
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${errors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {PAYMENT_METHODS.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 ${errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cartItems.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}

              <div className="border-t dark:border-gray-600 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatCurrency(cartTotal)}</span>
                </div>
              </div>

              {/* Discount Code Section */}
              <div className="border-t dark:border-gray-600 pt-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Discount Code</label>
                {discountAmount > 0 ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-green-800 dark:text-green-400">{discountCode}</span>
                      <span className="text-sm text-green-600 dark:text-green-400 ml-2">(-{formatCurrency(discountAmount)})</span>
                      {discountRemainingUses !== null && (
                        <span className="text-xs text-green-500 dark:text-green-400 block mt-1">{discountRemainingUses} uses left</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(''); }}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-gray-700 dark:text-gray-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyDiscount}
                      disabled={applyingDiscount}
                    >
                      {applyingDiscount ? '...' : 'Apply'}
                    </Button>
                  </div>
                )}
                {discountError && <p className="text-red-500 text-sm mt-1">{discountError}</p>}
              </div>

              {/* Discount Line */}
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="border-t dark:border-gray-600 pt-3 flex justify-between font-bold text-lg">
                <span className="text-gray-800 dark:text-gray-200">Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
