import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../services/api';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function Profile() {
  const { customer, isAuthenticated, logout, getProfile } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return;
      try {
        await getProfile();
        setFormData({
          name: customer?.name || '',
          phone: customer?.phone || '',
          address: customer?.address || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, getProfile]);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/profile" replace />;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex flex-col items-center mb-4">
              <Skeleton className="w-20 h-20 rounded-full mb-3" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-6" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <Skeleton className="h-6 w-32 mb-4" />
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow digits, spaces, dashes, parentheses, and plus sign
    const cleaned = value.replace(/[^0-9\s\-()]+/g, '');
    setFormData({ ...formData, phone: cleaned });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    // Validate phone (strip formatting, check digits only)
    const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
    if (cleanPhone && !/^[0-9]{10,11}$/.test(cleanPhone)) {
      setMessage('Phone number must be 10-11 digits');
      setSaving(false);
      return;
    }

    try {
      await api.updateCustomerProfile({
        name: formData.name,
        phone: cleanPhone || null,
        address: formData.address || null
      });
      await getProfile();
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: customer?.name || '',
      phone: customer?.phone || '',
      address: customer?.address || ''
    });
    setEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">My Profile</h1>

      {message && (
        <div className={`px-4 py-3 rounded-lg mb-4 ${message.includes('success') ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{customer?.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{customer?.email}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="text-gray-800 dark:text-gray-200">{customer?.phone || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Member since:</span>
                <span className="text-gray-800 dark:text-gray-200">{formatDate(customer?.createdAt)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {!editing ? (
                <Button variant="outline" className="w-full" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button variant="primary" className="w-full" onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
              <Button variant="danger" className="w-full" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Form */}
          {editing && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="09XX XXX XXXX"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">10-11 digits, spaces and dashes allowed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    placeholder="Enter your delivery address"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/wishlist" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-2xl">❤️</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">My Wishlist</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View saved items</p>
                </div>
              </Link>
              <Link to="/products" className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <span className="text-2xl">🛍️</span>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Shop</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Browse products</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Account Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-gray-800 dark:text-gray-200">{customer?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Phone</span>
                <span className="text-gray-800 dark:text-gray-200">{customer?.phone || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-2 border-b dark:border-gray-700">
                <span className="text-gray-500 dark:text-gray-400">Address</span>
                <span className="text-gray-800 dark:text-gray-200">{customer?.address || 'Not set'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 dark:text-gray-400">Member since</span>
                <span className="text-gray-800 dark:text-gray-200">{formatDate(customer?.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
