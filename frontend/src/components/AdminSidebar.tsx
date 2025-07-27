import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user } = useAuth();

  const adminNavigationItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: ChartBarIcon,
      description: 'Overview and analytics'
    },
    { 
      name: 'Products', 
      href: '/admin', 
      icon: ShoppingBagIcon,
      description: 'Manage product catalog'
    },
    { 
      name: 'Users', 
      href: '/admin/users', 
      icon: UserIcon,
      description: 'Manage user accounts'
    }
  ];

  const publicNavigationItems = [
    { name: 'Back to Store', href: '/', icon: HomeIcon },
    { name: 'View Products', href: '/products', icon: ShoppingBagIcon }
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
        bg-gradient-to-b from-indigo-900 to-indigo-800 shadow-xl transition-all duration-300 ease-in-out flex-shrink-0 flex flex-col
        ${isOpen ? 'w-80' : 'w-16'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0 lg:relative
        fixed top-0 left-0 h-screen z-50 lg:h-screen lg:static
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Admin Panel
                </h2>
                <p className="text-xs text-indigo-200">
                  Product Catalog
                </p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-indigo-700 transition-colors text-white"
          >
            {isOpen ? (
              <ChevronLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Info */}
        {isOpen && user && (
          <div className="p-4 border-b border-indigo-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.email}
                </p>
                <p className="text-xs text-indigo-200">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <div className="mb-4">
              {isOpen && (
                <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
                  Administration
                </h3>
              )}
              {adminNavigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-3 py-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-indigo-700 text-white shadow-lg' 
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                      }
                    `}
                    title={!isOpen ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs opacity-75">{item.description}</div>
                      </div>
                    )}
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full ml-auto"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Public Navigation */}
            <div className="pt-4 border-t border-indigo-700">
              {isOpen && (
                <h3 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">
                  Store
                </h3>
              )}
              {publicNavigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-indigo-700 text-white' 
                        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                      }
                    `}
                    title={!isOpen ? item.name : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="ml-3 font-medium text-sm">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
            <div className="text-center">
              <p className="text-xs text-indigo-200">
                Product Catalog Admin
              </p>
              <p className="text-xs text-indigo-300 mt-1">
                v1.0.0
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;
