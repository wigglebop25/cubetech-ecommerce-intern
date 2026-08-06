import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// Customer pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import CustomerLogin from './pages/customer/Login';
import Register from './pages/customer/Register';
import Profile from './pages/customer/Profile';
import Wishlist from './pages/customer/Wishlist';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import OrderDetail from './pages/admin/OrderDetail';
import CustomerManagement from './pages/admin/CustomerManagement';
import DiscountManagement from './pages/admin/DiscountManagement';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <CartProvider>
            <AuthProvider>
              <CustomerAuthProvider>
                <Routes>
                {/* Customer routes */}
                <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
                <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout showFooter={false}><Checkout /></CustomerLayout>} />
                <Route path="/order/:id" element={<CustomerLayout showFooter={false}><OrderConfirmation /></CustomerLayout>} />
                <Route path="/login" element={<CustomerLayout showFooter={false}><CustomerLogin /></CustomerLayout>} />
                <Route path="/register" element={<CustomerLayout showFooter={false}><Register /></CustomerLayout>} />
                <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
                <Route path="/wishlist" element={<CustomerLayout><Wishlist /></CustomerLayout>} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/products" element={<ProductManagement />} />
                  <Route path="/admin/categories" element={<CategoryManagement />} />
                  <Route path="/admin/orders" element={<OrderManagement />} />
                  <Route path="/admin/orders/:id" element={<OrderDetail />} />
                  <Route path="/admin/customers" element={<CustomerManagement />} />
                  <Route path="/admin/discounts" element={<DiscountManagement />} />
                </Route>
                </Routes>
              </CustomerAuthProvider>
            </AuthProvider>
          </CartProvider>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
