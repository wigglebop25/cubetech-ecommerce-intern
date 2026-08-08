import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import { IoMenu } from 'react-icons/io5';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 md:p-6 overflow-auto w-0 min-w-0">
        {/* Mobile header with hamburger */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
          >
            <IoMenu size={24} />
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
