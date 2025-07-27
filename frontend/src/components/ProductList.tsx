import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/Product';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  StarIcon, 
  ShoppingCartIcon,
  EyeIcon,
  TagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading = false }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart({ product_id: product.id, quantity: 1 });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= rating ? (
              <StarIconSolid className="w-4 h-4 text-yellow-400" />
            ) : (
              <StarIcon className="w-4 h-4 text-gray-300" />
            )}
          </div>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-300 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="h-8 bg-gray-300 rounded w-24"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <TagIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.id}`}
          className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300"
        >
          <div className="p-6">
            <div className="flex items-center space-x-6">
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                {product.main_image_url ? (
                  <img
                    src={product.main_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <TagIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {product.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.license}
                      </span>
                      {product.is_featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                      </div>
                      {product.download_count && (
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          <span>{product.download_count.toLocaleString()} downloads</span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {(product.feature_1 || product.feature_2 || product.feature_3) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[product.feature_1, product.feature_2, product.feature_3]
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full border"
                            >
                              {feature}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Price and Actions */}
                  <div className="flex flex-col items-end space-y-3 ml-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 flex items-center">
                        <CurrencyDollarIcon className="w-5 h-5 mr-1" />
                        {typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!user}
                      className={`
                        flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${user
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
