import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import SearchBar from '../../components/ui/SearchBar';
import Spinner from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';
import { useDebounce } from '../../hooks/useDebounce';

export default function OrderManagement() {
  const { orders, fetchOrders, updateOrderStatus } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetchOrders().then(() => setLoading(false));
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (debouncedSearch) {
      result = result.filter(o =>
        o.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        o.customerName.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (filterStatus) {
      result = result.filter(o => o.status === filterStatus);
    }
    return result;
  }, [orders, debouncedSearch, filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by order# or customer..." />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{order.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.orderDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {ORDER_STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 py-8">No orders found</p>
        )}
      </div>
    </div>
  );
}
