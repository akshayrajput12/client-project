import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types/Product';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProduct(productId);
      setProduct(data);
      // Set the main image as selected by default
      if (data.main_image_url) {
        setSelectedImage(data.main_image_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart({ product_id: product!.id, quantity });
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <LoadingSpinner text="Loading product details..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium">Error Loading Product</h3>
              <p className="text-sm mt-2">{error}</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => fetchProduct(parseInt(id!))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-text-primary hover:text-primary-teal"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Products
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 text-sm font-medium text-text-primary opacity-60 md:ml-2">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="bg-primary-bg shadow-xl rounded-2xl overflow-hidden border border-secondary-bg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group">
              {selectedImage || product.main_image_url ? (
                <>
                  <img
                    src={selectedImage || product.main_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Download Button Overlay */}
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => downloadImage(
                        selectedImage || product.main_image_url!,
                        `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_image.jpg`
                      )}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Download</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="text-lg text-indigo-600 font-semibold">{product.category}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery_images && product.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.main_image_url && (
                  <div className="relative group">
                    <button
                      onClick={() => setSelectedImage(product.main_image_url!)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all w-full ${
                        selectedImage === product.main_image_url ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={product.main_image_url} alt="Main" className="w-full h-full object-cover" />
                    </button>
                    <button
                      onClick={() => downloadImage(
                        product.main_image_url!,
                        `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_main.jpg`
                      )}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-1 rounded-md shadow-lg hover:shadow-xl transform hover:scale-110"
                      title="Download image"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                )}
                {product.gallery_images.map((image, index) => (
                  <div key={index} className="relative group">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all w-full ${
                        selectedImage === image ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                    <button
                      onClick={() => downloadImage(
                        image,
                        `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_gallery_${index + 1}.jpg`
                      )}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-1 rounded-md shadow-lg hover:shadow-xl transform hover:scale-110"
                      title="Download image"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-text-primary mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <StarRating rating={product.rating} size="lg" />
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-secondary-bg text-primary-teal border border-primary-teal">
                  {product.license}
                </span>
                {product.category && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-secondary-bg text-primary-teal border border-secondary-teal">
                    {product.category}
                  </span>
                )}
                {product.is_featured && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-secondary-teal text-white shadow-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">
                  ${Number(product.price || 0).toFixed(2)}
                </span>
                {product.download_count !== undefined && (
                  <span className="ml-4 text-lg text-text-primary opacity-60">
                    {product.download_count} downloads
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            {user ? (
              <div className="bg-secondary-bg p-6 rounded-xl border border-secondary-bg">
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="quantity" className="text-sm font-semibold text-text-primary">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-secondary-bg rounded-lg px-4 py-2 text-sm font-medium bg-primary-bg text-text-primary shadow-sm focus:ring-2 focus:ring-primary-teal focus:border-primary-teal"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-primary-teal text-white px-6 py-4 rounded-xl hover:bg-secondary-teal transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addingToCart ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </span>
                  ) : (
                    '🛒 Add to Cart'
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-secondary-bg border border-secondary-bg p-6 rounded-xl">
                <p className="text-sm text-text-primary mb-3 font-medium">Please log in to add items to cart</p>
                <Link
                  to="/login"
                  className="inline-block bg-primary-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-secondary-teal transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Log In
                </Link>
              </div>
            )}

            <div className="text-sm text-text-primary opacity-60 bg-secondary-bg px-3 py-2 rounded-lg">
              Product ID: {product.id}
            </div>
          </div>
        </div>
          </div>

        {/* Description */}
        <div className="px-8 pb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-text-primary opacity-80 leading-relaxed whitespace-pre-wrap text-lg">
                {product.description}
              </p>
            </div>
          </div>

          {/* Features */}
          {(product.feature_1 || product.feature_2 || product.feature_3 || product.feature_4 || product.feature_5) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[product.feature_1, product.feature_2, product.feature_3, product.feature_4, product.feature_5]
                  .filter(Boolean)
                  .map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-secondary-bg rounded-xl border border-secondary-teal">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-secondary-teal" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-text-primary font-medium">{feature}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Technical Details */}
          {(product.requirements || product.version || product.file_size || product.demo_url || product.documentation_url || product.support_email || product.tags) && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Technical Details</h2>
              <div className="bg-secondary-bg rounded-xl p-6 border border-secondary-bg">
                <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  {product.version && (
                    <div className="bg-primary-bg p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-text-primary opacity-70 mb-1">Version</dt>
                      <dd className="text-lg font-medium text-text-primary">{product.version}</dd>
                    </div>
                  )}
                  {product.file_size && (
                    <div className="bg-primary-bg p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-text-primary opacity-70 mb-1">File Size</dt>
                      <dd className="text-lg font-medium text-text-primary">{product.file_size}</dd>
                    </div>
                  )}
                  {product.demo_url && (
                    <div className="bg-primary-bg p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-text-primary opacity-70 mb-1">Demo</dt>
                      <dd>
                        <a
                          href={product.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-teal hover:text-secondary-teal font-medium underline"
                        >
                          View Live Demo
                        </a>
                      </dd>
                    </div>
                  )}
                  {product.documentation_url && (
                    <div className="bg-primary-bg p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-text-primary opacity-70 mb-1">Documentation</dt>
                      <dd>
                        <a
                          href={product.documentation_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-teal hover:text-secondary-teal font-medium underline"
                        >
                          View Documentation
                        </a>
                      </dd>
                    </div>
                  )}
                  {product.support_email && (
                    <div className="bg-primary-bg p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-text-primary opacity-70 mb-1">Support</dt>
                      <dd>
                        <a
                          href={`mailto:${product.support_email}`}
                          className="text-primary-teal hover:text-secondary-teal font-medium underline"
                        >
                          {product.support_email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {product.tags && (
                    <div className="bg-primary-bg p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-text-primary opacity-70 mb-2">Tags</dt>
                      <dd className="flex flex-wrap gap-2">
                        {product.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-secondary-bg text-primary-teal text-sm font-medium rounded-full border border-primary-teal"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {product.requirements && (
                    <div className="sm:col-span-2 bg-white p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-semibold text-gray-600 mb-2">System Requirements</dt>
                      <dd className="text-gray-900 whitespace-pre-wrap leading-relaxed">{product.requirements}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Information</h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <dt className="text-sm font-semibold text-gray-600 mb-1">Created</dt>
                  <dd className="text-gray-900 font-medium">
                    {new Date(product.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <dt className="text-sm font-semibold text-gray-600 mb-1">Last Updated</dt>
                  <dd className="text-gray-900 font-medium">
                    {new Date(product.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </Link>

              {/* Download All Images Button */}
              {(product.main_image_url || (product.gallery_images && product.gallery_images.length > 0)) && (
                <button
                  onClick={async () => {
                    const images = [];
                    if (product.main_image_url) {
                      images.push({ url: product.main_image_url, name: 'main' });
                    }
                    if (product.gallery_images) {
                      product.gallery_images.forEach((img, index) => {
                        images.push({ url: img, name: `gallery_${index + 1}` });
                      });
                    }
                    
                    for (const img of images) {
                      await downloadImage(
                        img.url,
                        `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}_${img.name}.jpg`
                      );
                      // Small delay between downloads
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }
                  }}
                  className="inline-flex items-center px-6 py-3 border border-green-300 text-sm font-semibold rounded-xl text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download All Images
                </button>
              )}
            </div>

            {user?.is_admin && (
              <Link
                to={`/admin?edit=${product.id}`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Product
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
