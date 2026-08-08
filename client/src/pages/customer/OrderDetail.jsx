import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { Skeleton, SkeletonTable } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function CustomerOrderDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useCustomerAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await api.getCustomerOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/orders" replace />;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-6 w-24" />
            </div>
            <SkeletonTable rows={3} cols={4} />
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-24 mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Order Not Found</h2>
        <Link to="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const canCancel = ['Pending', 'Confirmed'].includes(order.status);

  const handleCancel = async () => {
    try {
      await api.cancelCustomerOrder(order.id);
      setOrder(prev => ({ ...prev, status: 'Cancelled' }));
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <Link to="/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block">
            ← Back to My Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Order {order.id}</h1>
        </div>
        {canCancel && (
          <Button variant="danger" onClick={() => setShowCancelDialog(true)}>
            Cancel Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Order Status</h2>
            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <span className="text-sm text-gray-500 dark:text-gray-400">Placed on {formatDate(order.orderDate)}</span>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Items</h2>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{item.productName}</td>
                    <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-800 dark:text-gray-200">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-800 dark:text-gray-200">{formatCurrency(order.shippingCost)}</span>
                </div>
              )}
              {order.discount && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Discount ({order.discount.code})</span>
                  <span>-{formatCurrency(order.subtotal * order.discount.value / 100)}</span>
                </div>
              )}
              <div className="border-t dark:border-gray-600 pt-3 flex justify-between font-bold text-lg">
                <span className="text-gray-800 dark:text-gray-200">Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Payment</span>
                <span className="text-gray-800 dark:text-gray-200">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-gray-800 dark:text-gray-200 min-w-0 text-right break-all">{order.email}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 dark:text-gray-400">Phone</span>
                <span className="text-gray-800 dark:text-gray-200 min-w-0 text-right">{order.phone}</span>
              </div>
              {order.address && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Address</span>
                  <p className="text-gray-800 dark:text-gray-200 mt-1">{order.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${order.id}? This action cannot be undone.`}
      />
    </div>
  );
}
