import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatters';

export default function CustomerManagement() {
  const { customers, fetchCustomers } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers().then(() => setLoading(false));
  }, [fetchCustomers]);

  if (loading) {
    return (
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-6" />
        <SkeletonTable rows={8} cols={6} />
      </div>
    );
  }

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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hidden sm:table-cell">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 hidden lg:table-cell">{formatCurrency(customer.totalSpent)}</td>
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
