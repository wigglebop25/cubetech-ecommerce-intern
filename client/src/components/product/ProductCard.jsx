import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { api } from '../../services/api';
import { StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { IoHeartOutline, IoHeart } from 'react-icons/io5';

export default function ProductCard({ product, isWishlisted: initialWishlisted = false, onWishlistChange }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0 && product.status === 'Active') {
      addToCart(product);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login?redirect=/products');
      return;
    }

    const previousState = isWishlisted;
    setIsWishlisted(!isWishlisted);

    try {
      if (previousState) {
        await api.removeFromWishlist(product.id);
      } else {
        await api.addToWishlist(product.id);
      }
      if (onWishlistChange) onWishlistChange();
    } catch (error) {
      setIsWishlisted(previousState);
      console.error('Error toggling wishlist:', error);
    }
  };

  const isOutOfStock = product.stock === 0 || product.status === 'Out_of_Stock';
  const isInactive = product.status === 'Inactive';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
          <img
            src={product.image || 'https://via.placeholder.com/400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />
          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:scale-110 transition-transform z-10 cursor-pointer"
          >
            {isWishlisted ? (
              <IoHeart size={20} className="text-red-500" />
            ) : (
              <IoHeartOutline size={20} className="text-gray-400 hover:text-red-500" />
            )}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {product.category?.name || 'Uncategorized'}
        </span>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
          {formatCurrency(product.price)}
        </p>

        {/* Stock Status */}
        <div className="mt-2">
          {isOutOfStock ? (
            <StatusBadge status="Out_of_Stock" />
          ) : isInactive ? (
            <StatusBadge status="Inactive" />
          ) : (
            <StatusBadge status="Active" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Link to={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isInactive}
            className="flex-1"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
