import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatters';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0 && product.status === 'Active') {
      addToCart(product);
    }
  };

  const isOutOfStock = product.stock === 0 || product.status === 'Out_of_Stock';
  const isInactive = product.status === 'Inactive';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Image */}
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image || 'https://via.placeholder.com/400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=No+Image';
            }}
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {product.category?.name || 'Uncategorized'}
        </span>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 mt-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-lg font-bold text-blue-600 mt-1">
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
