import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/ui/SearchBar';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';
import { IoDownload } from 'react-icons/io5';

const getNextStatuses = (currentStatus) => {
  const statusOrder = ['Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  return statusOrder.slice(currentIndex + 1);
};

export default function OrderManagement() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 10);
        if (debouncedSearch) params.append('search', debouncedSearch);
        if (filterStatus) params.append('status', filterStatus);

        const data = await api.getOrders(params.toString());
        setOrders(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.totalItems);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [debouncedSearch, filterStatus, page, isAuthenticated]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancel = (order) => {
    setOrderToCancel(order);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await api.updateOrderStatus(orderToCancel.id, 'Cancelled');
      setOrders(prev => prev.map(o => o.id === orderToCancel.id ? { ...o, status: 'Cancelled' } : o));
      setShowCancelDialog(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (search) params.append('search', search);
      params.append('format', 'csv');

      const token = sessionStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${API_URL}/orders/export?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orders.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting orders:', error);
    }
  };

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Order Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by order# or customer..." />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2">
          <IoDownload size={18} />
          Export CSV
        </Button>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Showing {orders.length} of {totalItems} orders
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <option value={order.status}>{order.status}</option>
                        {getNextStatuses(order.status).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {['Pending', 'Confirmed', 'Preparing'].includes(order.status) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(order)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No orders found</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Order"
        message={`Are you sure you want to cancel order ${orderToCancel?.id}? This will restore stock for this order.`}
      />
    </div>
  );
}
