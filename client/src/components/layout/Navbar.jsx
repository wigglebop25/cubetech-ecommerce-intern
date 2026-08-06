import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { IoCart, IoMenu, IoClose, IoPerson, IoHeart, IoLogOut, IoChevronDown, IoSunny, IoMoon } from 'react-icons/io5';

export default function Navbar() {
  const { cartCount } = useCart();
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="CubeTech Shop" className="h-8" />
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400 hidden sm:block">CubeTech Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                <IoHeart size={22} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <IoCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {customer?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block">{customer?.name?.split(' ')[0]}</span>
                  <IoChevronDown size={14} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{customer?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{customer?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <IoPerson size={16} /> My Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <IoHeart size={16} /> My Wishlist
                    </Link>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full cursor-pointer"
                    >
                      <IoLogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <IoPerson size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
            </button>
            {isAuthenticated && (
              <Link to="/wishlist" className="relative p-2 text-gray-600 dark:text-gray-300">
                <IoHeart size={22} />
              </Link>
            )}
            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-300">
              <IoCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              {mobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t dark:border-gray-700">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-2 text-sm font-medium ${
                  isActive(link.path) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t dark:border-gray-700 mt-2 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{customer?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{customer?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-2 text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    My Wishlist
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="block py-2 px-2 text-sm font-medium text-red-600 w-full text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
