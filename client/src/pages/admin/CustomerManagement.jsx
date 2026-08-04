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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Orders</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{customer.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{customer.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-4 py-3"><StatusBadge status={customer.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && (
          <p className="text-center text-gray-500 py-8">No customers found</p>
        )}
      </div>
    </div>
  );
}
