import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';
import StarRating from './StarRating';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 group transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.main_image_url ? (
          <img
            src={product.main_image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-sm text-indigo-600 font-semibold">{product.category}</span>
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-gray-100">
          <span className="text-sm font-bold text-gray-900">
            ${Number(product.price || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Category and License */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-indigo-600 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-1 rounded-full border border-indigo-100">
            {product.category}
          </span>
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{product.license}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Features */}
        {(product.feature_1 || product.feature_2 || product.feature_3 || product.feature_4 || product.feature_5) && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {[product.feature_1, product.feature_2, product.feature_3].filter(Boolean).slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 px-2 py-1 rounded-full border border-indigo-100"
                >
                  {feature}
                </span>
              ))}
              {[product.feature_1, product.feature_2, product.feature_3, product.feature_4, product.feature_5].filter(Boolean).length > 3 && (
                <span className="text-xs text-gray-500 font-medium">
                  +{[product.feature_1, product.feature_2, product.feature_3, product.feature_4, product.feature_5].filter(Boolean).length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rating and Downloads */}
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={product.rating} />
          {product.download_count !== undefined && (
            <span className="text-xs text-gray-500">
              {product.download_count} downloads
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-300 text-center text-sm font-semibold border border-gray-200 hover:border-gray-300"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
