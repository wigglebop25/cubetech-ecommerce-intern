import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';

const getNextStatuses = (currentStatus) => {
  const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  return statusOrder.slice(currentIndex + 1);
};

export default function OrderDetail() {
  const { id } = useParams();
  const { updateOrderStatus } = useData();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

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

  const handleStatusChange = async (newStatus) => {
    await updateOrderStatus(id, newStatus);
    setOrder(prev => ({ ...prev, status: newStatus }));
  };

  const handleCancel = async () => {
    try {
      await api.updateOrderStatus(id, 'Cancelled');
      setOrder(prev => ({ ...prev, status: 'Cancelled' }));
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
        <Link to="/admin/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order {order.id}</h1>
        <Link to="/admin/orders">
          <Button variant="secondary">Back to Orders</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">{order.address}</p>
            </div>
            {order.notes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Order Notes</p>
                <p className="font-medium">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Ordered Products</h2>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.productName}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 text-right">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-blue-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            <div className="mb-4">
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500 mb-4">Order Date: {formatDate(order.orderDate)}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                <option value={order.status}>{order.status}</option>
                {getNextStatuses(order.status).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {['Pending', 'Confirmed', 'Preparing'].includes(order.status) && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Order
                </Button>
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
        message={`Are you sure you want to cancel order ${order.id}? This will restore stock for this order.`}
      />
    </div>
  );
}
