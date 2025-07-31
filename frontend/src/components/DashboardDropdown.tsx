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

  // Get admin username from localStorage or use default
  const getAdminUsername = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.username || userData.name || 'Admin';
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return 'Admin';
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Navigate to login page
    navigate('/login');
    setIsOpen(false);
  };

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
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" />
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
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{getAdminUsername()}</h3>
            <p className="text-sm text-gray-500">Quick access</p>
          </div>

          {/* Dashboard Stats Grid */}
          <div className="px-4 py-4">
            <div className="flex justify-between">
              {/* Products */}
              <DashButton
                title="Products"
                value={stats.totalProducts.toString()}
                icon="📦"
                backgroundColor="transparent"
                className="h-18 w-16"
                iconOnly={true}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/products');
                }}
              />

              {/* Users */}
              <DashButton
                title="Users"
                value={stats.totalUsers.toString()}
                icon="👥"
                backgroundColor="transparent"
                className="h-18 w-16"
                iconOnly={true}
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/users');
                }}
              />

              {/* Logout */}
              <DashButton
                title="Logout"
                value=""
                icon="🚪"
                backgroundColor="transparent"
                className="h-18 w-16"
                iconOnly={true}
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDropdown;