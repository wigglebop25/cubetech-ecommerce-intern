import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Customer pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import OrderDetail from './pages/admin/OrderDetail';
import CustomerManagement from './pages/admin/CustomerManagement';

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <CartProvider>
          <AuthProvider>
            <Routes>
              {/* Customer routes */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
              <Route path="/product/:id" element={<><Navbar /><ProductDetail /><Footer /></>} />
              <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
              <Route path="/checkout" element={<><Navbar /><Checkout /></>} />
              <Route path="/order/:id" element={<><Navbar /><OrderConfirmation /></>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/orders/:id" element={<OrderDetail />} />
                <Route path="/admin/customers" element={<CustomerManagement />} />
              </Route>
            </Routes>
          </AuthProvider>
        </CartProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
