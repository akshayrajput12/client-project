import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  TagIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onFilterChange?: (filters: FilterState) => void;
  showFilters?: boolean;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  rating: number;
  license: string;
  featured: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  onFilterChange, 
  showFilters = false 
}) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    license: '',
    featured: false
  });

  const categories = [
    'Web Development',
    'Mobile Apps',
    'Desktop Software',
    'Games',
    'Utilities',
    'Design Tools',
    'Business',
    'Education'
  ];

  const licenses = ['Free', 'Premium', 'Enterprise'];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: '',
      priceRange: [0, 1000],
      rating: 0,
      license: '',
      featured: false
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Products', href: '/products', icon: ShoppingBagIcon },
    ...(user ? [
      { name: 'Cart', href: '/cart', icon: ShoppingBagIcon },
      { name: 'Profile', href: '/profile', icon: UserIcon }
    ] : []),
    ...(isAdmin ? [
      { name: 'Admin Dashboard', href: '/admin', icon: Cog6ToothIcon },
      { name: 'Manage Users', href: '/admin/users', icon: UserIcon }
    ] : [])
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col flex-shrink-0
        ${isOpen ? 'w-80' : 'w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0 lg:relative
        fixed top-0 left-0 h-screen z-50 lg:h-auto lg:static
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {isOpen && (
            <h2 className="text-xl font-bold text-gray-800">
              Product Catalog
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Navigation */}
          <nav className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-500' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Filters Section */}
        {showFilters && isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <TagIcon className="w-4 h-4 mr-1" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <StarIcon className="w-4 h-4 mr-1" />
                  Minimum Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`p-1 ${
                        filters.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <StarIcon className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* License Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Type
                </label>
                <select
                  value={filters.license}
                  onChange={(e) => handleFilterChange('license', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Licenses</option>
                  {licenses.map((license) => (
                    <option key={license} value={license}>
                      {license}
                    </option>
                  ))}
                </select>
              </div>

              {/* Featured Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Products Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
