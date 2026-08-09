import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../../components/product/QuantitySelector';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const [removeItem, setRemoveItem] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          message="Your cart is empty"
          action="Continue Shopping"
          onAction={() => window.location.href = '/products'}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items - Scrollable Container */}
        <div className="lg:col-span-2 max-h-[70vh] overflow-y-auto pr-2 cart-scroll space-y-4">
          {cartItems.map(item => (
            <div key={item.productId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatCurrency(item.price)} each</p>
                <div className="mt-3 mb-8 relative">
                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(qty) => updateQuantity(item.productId, qty)}
                    max={item.stock || 99}
                  />
                </div>
                <button
                  onClick={() => setRemoveItem(item)}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 mt-2 cursor-pointer transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-800 dark:text-gray-200">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary - Sticky */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <div className="border-t dark:border-gray-600 pt-3 flex justify-between font-bold text-lg">
                <span className="text-gray-800 dark:text-gray-200">Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(cartTotal)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
            <Link to="/products" className="block text-center text-sm text-blue-600 dark:text-blue-400 mt-4 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!removeItem}
        onClose={() => setRemoveItem(null)}
        onConfirm={() => {
          removeFromCart(removeItem.productId);
          setRemoveItem(null);
        }}
        title="Remove Item"
        message={`Are you sure you want to remove "${removeItem?.name}" from your cart?`}
        confirmText="Remove"
      />
    </div>
  );
}
