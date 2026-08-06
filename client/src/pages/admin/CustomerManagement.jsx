import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import Spinner from '../../components/ui/Spinner';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

export default function CustomerManagement() {
  const { customers, fetchCustomers } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers().then(() => setLoading(false));
  }, [fetchCustomers]);

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Customer Management</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-4 py-3"><StatusBadge status={customer.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No customers found</p>
        )}
      </div>
    </div>
  );
}
