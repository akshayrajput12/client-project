import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/Product';
import { apiService } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import ProductForm from '../components/ProductForm';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

type ViewMode = 'dashboard' | 'create' | 'edit';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const { user, isAdmin, isLoading } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin && !isLoading) {
      fetchProducts();
      
      // Check if we should edit a specific product
      const editId = searchParams.get('edit');
      if (editId) {
        setViewMode('edit');
        // Find the product to edit after products are loaded
      }
    }
  }, [user, isAdmin, isLoading, searchParams]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && products.length > 0) {
      const productId = parseInt(editId);
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setViewMode('edit');
      }
    }
  }, [products, searchParams]);

  // Check if user is admin
  if (isLoading) {
    return (
      <AdminLayout title="Loading..." subtitle="Checking permissions...">
        <LoadingSpinner text="Checking permissions..." />
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="Admin Dashboard" subtitle="Authentication Required">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Log In
          </Link>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout title="Access Denied" subtitle="Insufficient Permissions">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <Link
            to="/"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Products
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const handleCreateProduct = async (data: CreateProductRequest | UpdateProductRequest) => {
    try {
      setFormLoading(true);
      await apiService.createProduct(data as CreateProductRequest);
      await fetchProducts();
      setViewMode('dashboard');
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (data: UpdateProductRequest) => {
    if (!selectedProduct) return;
    
    try {
      setFormLoading(true);
      await apiService.updateProduct(selectedProduct.id, data);
      await fetchProducts();
      setViewMode('dashboard');
      setSelectedProduct(null);
      setSearchParams({});
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      await apiService.deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewMode('edit');
    setSearchParams({ edit: product.id.toString() });
  };

  const handleCancelForm = () => {
    setViewMode('dashboard');
    setSelectedProduct(null);
    setSearchParams({});
  };



  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Loading dashboard data...">
        <LoadingSpinner text="Loading admin dashboard..." />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Error" subtitle="Failed to load dashboard">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium">Error Loading Dashboard</h3>
            <p className="text-sm mt-2">{error}</p>
          </div>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }



  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Manage your product catalog"
    >
      <div className={`${viewMode === 'dashboard' ? 'space-y-6' : 'h-full'}`}>

      {viewMode === 'dashboard' && (
        <>

          {/* Actions */}
          <div className="mb-6">
            <button
              onClick={() => setViewMode('create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">All Products</h2>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first product.</p>
                <button
                  onClick={() => setViewMode('create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add New Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.license}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StarRating rating={product.rating} size="sm" showNumber={false} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(product.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteLoading === product.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              {deleteLoading === product.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {viewMode === 'create' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">Create New Product</h2>
          </div>
          <div className="flex-1 min-h-0">
            <ProductForm
              onSubmit={handleCreateProduct}
              onCancel={handleCancelForm}
              isLoading={formLoading}
            />
          </div>
        </div>
      )}

      {viewMode === 'edit' && selectedProduct && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Product: {selectedProduct.name}
            </h2>
          </div>
          <div className="flex-1 min-h-0">
            <ProductForm
              product={selectedProduct}
              onSubmit={handleUpdateProduct}
              onCancel={handleCancelForm}
              isLoading={formLoading}
            />
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
