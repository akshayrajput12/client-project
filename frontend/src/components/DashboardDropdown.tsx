import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // Get user data from localStorage - based on database schema (users table with email field)
  const getUserData = () => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        // Based on schema: users table has email field as primary identifier
        const email = userData.email || 'admin@admin.com';
        return {
          username: email.split('@')[0], // Extract username from email
          email: email
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }

    // Try to get from token if user object doesn't exist
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT token to get user info (basic decode, not secure validation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || 'admin@admin.com';
        return {
          username: email.split('@')[0],
          email: email
        };
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }

    // Default fallback based on schema default admin user
    return {
      username: 'admin',
      email: 'admin@admin.com'
    };
  };

  const handleLogout = () => {
    try {
      // Clear all stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      sessionStorage.clear();

      // Clear any other app-specific storage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Close dropdown first
      setIsOpen(false);

      // Navigate to login page
      navigate('/login', { replace: true });

      // Force page reload to ensure complete logout
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      // Fallback: still navigate to login even if cleanup fails
      setIsOpen(false);
      navigate('/login', { replace: true });
    }
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
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transform transition-all duration-200">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">@{getUserData().username}</h3>
            <p className="text-sm text-gray-500 mt-1">{getUserData().email}</p>
          </div>

          {/* Navigation Icons */}
          <div className="px-6 py-6">
            <div className="flex justify-between items-center">
              {/* Products */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/products');
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">Products</span>
              </div>

              {/* Users */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/admin/users');
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">Users</span>
              </div>

              {/* Logout */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onClick={handleLogout}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDropdown;