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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <IoCheckmarkCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase.</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Order Number</span>
            <span className="font-bold text-gray-800">{order.id}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Date</span>
            <span className="text-gray-800">{formatDate(order.orderDate)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Payment Method</span>
            <span className="text-gray-800">{order.paymentMethod}</span>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-3">Items</h3>
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{item.productName} x{item.quantity}</span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(order.total)}</span>
          </div>
        </div>

        <Link to="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
