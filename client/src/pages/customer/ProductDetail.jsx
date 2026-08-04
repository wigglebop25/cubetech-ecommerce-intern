import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';
import ProductGrid from '../../components/product/ProductGrid';
import QuantitySelector from '../../components/product/QuantitySelector';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import Spinner from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/formatters';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);

        // Fetch related products
        if (data.category?.name) {
          const relatedData = await api.getProducts(`category=${data.category.name}`);
          setRelated((relatedData.data || []).filter(p => p.id !== data.id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage('Added to cart!');
    setTimeout(() => setAddedMessage(''), 2000);
  };

  if (loading) return <Spinner size="lg" className="min-h-[60vh]" />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <Link to="/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0 || product.status === 'Out_of_Stock';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image || 'https://via.placeholder.com/600?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600?text=No+Image';
            }}
          />
        </div>

        {/* Details */}
        <div>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category?.name}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">{formatCurrency(product.price)}</p>

          <div className="flex items-center gap-3 mb-4">
            <StatusBadge status={isOutOfStock ? 'Out_of_Stock' : 'Active'} />
            <span className="text-sm text-gray-500">{product.stock} available</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {!isOutOfStock && (
            <div className="flex items-center gap-4 mb-6">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                max={product.stock}
              />
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                Add to Cart
              </Button>
            </div>
          )}

          {addedMessage && (
            <p className="text-green-600 font-medium mt-2">{addedMessage}</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <ProductGrid>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}
    </div>
  );
}
