import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import Spinner from '../../components/ui/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IoCart, IoList, IoTime, IoCheckmarkCircle, IoPeople, IoCash } from 'react-icons/io5';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, salesRes] = await Promise.all([
          api.getStats(),
          api.getDashboard()
        ]);
        setStats(statsRes);
        setSalesData(salesRes.recentOrders || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  const summaryCards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: IoCart, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: IoList, color: 'bg-purple-500' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: IoTime, color: 'bg-yellow-500' },
    { label: 'Completed Orders', value: stats?.completedOrders || 0, icon: IoCheckmarkCircle, color: 'bg-green-500' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: IoPeople, color: 'bg-pink-500' },
    { label: 'Total Sales', value: formatCurrency(stats?.totalSales || 0), icon: IoCash, color: 'bg-indigo-500' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                <card.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {salesData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order #</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesData.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        )}
      </div>
    </div>
  );
}
