import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashButton from './DashButton';

interface DashboardDropdownProps {
  stats: {
    totalSales: number;
    totalUsers: number;
    totalProducts: number;
    featuredProducts: number;
    freeProducts: number;
    paidProducts: number;
    averageRating: number;
    licenseTypes: number;
  };
}

const DashboardDropdown: React.FC<DashboardDropdownProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dashboard grid icon (4 squares)
  const DashboardIcon = () => (
    <svg 
      className="h-6 w-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2"/>
    </svg>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dashboard Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
        title="Dashboard Overview"
      >
        <DashboardIcon />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
            <p className="text-sm text-gray-500">Quick stats and navigation</p>
          </div>

          {/* Dashboard Stats Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {/* Total Sales */}
              <DashButton
                title="Total Sales"
                value={`€${stats.totalSales.toFixed(2)}`}
                icon="€"
                backgroundColor="#20B2AA"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  console.log('Total Sales clicked');
                }}
              />

              {/* Users */}
              <DashButton
                title="Users"
                value={stats.totalUsers.toString()}
                icon="👥"
                backgroundColor="#4169E1"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/users');
                }}
              />

              {/* Products */}
              <DashButton
                title="Products"
                value={stats.totalProducts.toString()}
                icon="📦"
                backgroundColor="#32CD32"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/products');
                }}
              />

              {/* Featured Products */}
              <DashButton
                title="Featured"
                value={stats.featuredProducts.toString()}
                icon="⭐"
                backgroundColor="#F59E0B"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  console.log('Featured clicked');
                }}
              />

              {/* Free Products */}
              <DashButton
                title="Free"
                value={stats.freeProducts.toString()}
                icon="🆓"
                backgroundColor="#10B981"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  console.log('Free clicked');
                }}
              />

              {/* Paid Products */}
              <DashButton
                title="Paid"
                value={stats.paidProducts.toString()}
                icon="💎"
                backgroundColor="#EF4444"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  console.log('Paid clicked');
                }}
              />

              {/* Average Rating */}
              <DashButton
                title="Rating"
                value={stats.averageRating.toFixed(1)}
                icon="⭐"
                backgroundColor="#6366F1"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  console.log('Rating clicked');
                }}
              />

              {/* License Types */}
              <DashButton
                title="Licenses"
                value={stats.licenseTypes.toString()}
                icon="📄"
                backgroundColor="#8B5CF6"
                className="h-20"
                onClick={() => {
                  setIsOpen(false);
                  console.log('Licenses clicked');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDropdown;