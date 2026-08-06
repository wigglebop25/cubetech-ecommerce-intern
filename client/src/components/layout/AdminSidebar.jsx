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
  IoMoon
} from 'react-icons/io5';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: IoGrid },
  { path: '/admin/products', label: 'Products', icon: IoCart },
  { path: '/admin/categories', label: 'Categories', icon: IoPricetag },
  { path: '/admin/orders', label: 'Orders', icon: IoList },
  { path: '/admin/customers', label: 'Customers', icon: IoPeople },
  { path: '/admin/discounts', label: 'Discounts', icon: IoPricetag }
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Brand */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold">CubeTech Admin</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
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
  );
}
