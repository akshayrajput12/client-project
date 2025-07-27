import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar, { FilterState } from './Sidebar';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types/Product';
import { apiService } from '../services/api';
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  showFilters?: boolean;
  onFilterChange?: (filters: FilterState) => void;
  onSearch?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showFilters = false,
  onFilterChange,
  onSearch
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartSummary } = useCart();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    onSearch?.(query);

    if (query.length > 1) {
      try {
        const products = await apiService.getProducts();
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        setSearchSuggestions(filtered);
      } catch (error) {
        console.error('Search error:', error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
    }
  };

  // Handle product selection from search
  const handleProductSelect = (product: Product) => {
    navigate(`/products/${product.id}`);
    setSearchSuggestions([]);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        showFilters={showFilters}
        onFilterChange={onFilterChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 min-w-0">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left side - Mobile menu button and search */}
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                {/* Search Bar */}
                <div className="flex-1 max-w-lg">
                  <SearchBar
                    onSearch={handleSearch}
                    onProductSelect={handleProductSelect}
                    suggestions={searchSuggestions}
                    placeholder="Search products..."
                    className="w-full"
                  />
                </div>
              </div>

              {/* Right side - User menu */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    {/* Cart Icon */}
                    <button
                      onClick={() => navigate('/cart')}
                      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                    >
                      <ShoppingCartIcon className="h-6 w-6" />
                      {cartSummary.total_items > 0 && (
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartSummary.total_items}
                        </span>
                      )}
                    </button>

                    {/* User Menu */}
                    <div className="relative group">
                      <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                        <UserIcon className="h-6 w-6" />
                        <span className="hidden sm:block text-sm font-medium">
                          {user.email}
                        </span>
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <button
                          onClick={() => navigate('/profile')}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </button>
                        {user.is_admin && (
                          <button
                            onClick={() => navigate('/admin')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </button>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
