import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { IoCheckmarkCircle } from 'react-icons/io5';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Order Not Found</h2>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <IoCheckmarkCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Thank you for your purchase.</p>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6 text-left">
          <div className="flex justify-between mb-4 gap-4">
            <span className="text-gray-500 dark:text-gray-400">Order Number</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 truncate">{order.id}</span>
          </div>
          <div className="flex justify-between mb-4 gap-4">
            <span className="text-gray-500 dark:text-gray-400">Date</span>
            <span className="text-gray-800 dark:text-gray-200">{formatDate(order.orderDate)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex justify-between mb-4 gap-4">
            <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
            <span className="text-gray-800 dark:text-gray-200">{order.paymentMethod}</span>
          </div>

          <div className="border-t dark:border-gray-600 pt-4 mt-4">
            <h3 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Items</h3>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-2 gap-2">
                <span className="text-gray-600 dark:text-gray-400 truncate mr-2">{item.productName} x{item.quantity}</span>
                <span className="text-gray-800 dark:text-gray-200 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t dark:border-gray-600 pt-4 mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span className="text-gray-800 dark:text-gray-200">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Tax (12% VAT)</span>
                <span className="text-gray-800 dark:text-gray-200">{formatCurrency(order.tax)}</span>
              </div>
            )}
            {order.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="text-gray-800 dark:text-gray-200">{formatCurrency(order.shippingCost)}</span>
              </div>
            )}
            {order.discount && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount ({order.discount.code})</span>
                <span>-{formatCurrency(order.discount.type === 'percentage' ? (order.subtotal * order.discount.value / 100) : order.discount.value)}</span>
              </div>
            )}
          </div>

          <div className="border-t dark:border-gray-600 pt-4 mt-4 flex justify-between font-bold text-lg">
            <span className="text-gray-800 dark:text-gray-200">Total</span>
            <span className="text-blue-600 dark:text-blue-400">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <Link to="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
