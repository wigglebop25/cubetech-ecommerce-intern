import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function Wishlist() {
  const { isAuthenticated } = useCustomerAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await api.getWishlist();
        setWishlist(data || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/wishlist" replace />;
  }

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  const handleWishlistChange = async () => {
    try {
      const data = await api.getWishlist();
      setWishlist(data || []);
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Wishlist</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">{wishlist.length} items</span>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <ProductCard
              key={item.productId}
              product={item.product}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          message="Your wishlist is empty"
          action="Browse Products"
          onAction={() => window.location.href = '/products'}
        />
      )}
    </div>
  );
}
