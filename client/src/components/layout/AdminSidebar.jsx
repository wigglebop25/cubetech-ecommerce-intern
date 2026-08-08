import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  IoGrid,
  IoCart,
  IoPricetag,
  IoList,
  IoPeople,
  IoLogOut,
  IoStorefront,
  IoSunny,
  IoMoon,
  IoClose
} from 'react-icons/io5';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: IoGrid },
  { path: '/admin/products', label: 'Products', icon: IoCart },
  { path: '/admin/categories', label: 'Categories', icon: IoPricetag },
  { path: '/admin/orders', label: 'Orders', icon: IoList },
  { path: '/admin/customers', label: 'Customers', icon: IoPeople },
  { path: '/admin/discounts', label: 'Discounts', icon: IoPricetag }
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold">CubeTech Admin</h2>
          <button onClick={onClose} className="md:hidden p-1 text-gray-400 hover:text-white cursor-pointer">
            <IoClose size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors w-full cursor-pointer mb-2"
          >
            {isDark ? <IoSunny size={18} /> : <IoMoon size={18} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mb-2"
          >
            <IoStorefront size={18} />
            View Store
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors w-full cursor-pointer"
          >
            <IoLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
