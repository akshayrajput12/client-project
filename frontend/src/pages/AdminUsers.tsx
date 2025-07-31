import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { apiService } from '../services/api';
import {
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'admin' | 'user'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users from the database using the API service
      const response = await apiService.getUsers();
      setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
      (filterType === 'admin' && user.is_admin) ||
      (filterType === 'user' && !user.is_admin);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.is_admin).length;
    const regularUsers = totalUsers - adminUsers;

    return { totalUsers, adminUsers, regularUsers };
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <AdminLayout title="User Management" subtitle="Manage user accounts">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Management" subtitle="Manage user accounts and permissions">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-bg rounded-lg shadow p-6 border border-secondary-bg">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-bg rounded-lg">
                <UserIcon className="h-6 w-6 text-primary-teal" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-primary opacity-70">Total Users</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-bg rounded-lg shadow p-6 border border-secondary-bg">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-teal rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-primary opacity-70">Administrators</p>
                <p className="text-2xl font-bold text-text-primary">{stats.adminUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-bg rounded-lg shadow p-6 border border-secondary-bg">
            <div className="flex items-center">
              <div className="p-2 bg-primary-teal rounded-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-primary opacity-70">Regular Users</p>
                <p className="text-2xl font-bold text-text-primary">{stats.regularUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-primary-bg rounded-lg shadow border border-secondary-bg">
          <div className="p-6 border-b border-secondary-bg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-text-primary opacity-60" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-secondary-bg rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-primary-teal bg-primary-bg text-text-primary"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-text-primary opacity-60" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'admin' | 'user')}
                  className="border border-secondary-bg rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-teal focus:border-primary-teal bg-primary-bg text-text-primary"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Administrators</option>
                  <option value="user">Regular Users</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-bg">
              <thead className="bg-secondary-bg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-primary-bg divide-y divide-secondary-bg">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary-bg">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-secondary-bg flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-primary-teal" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-text-primary flex items-center">
                            <EnvelopeIcon className="h-4 w-4 text-text-primary opacity-60 mr-2" />
                            {user.email}
                          </div>
                          <div className="text-sm text-text-primary opacity-60">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_admin
                        ? 'bg-secondary-teal text-white'
                        : 'bg-primary-teal text-white'
                        }`}>
                        {user.is_admin ? (
                          <>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Administrator
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3 w-3 mr-1" />
                            Regular User
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-text-primary opacity-60 mr-2" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-text-primary opacity-60 mr-2" />
                        {formatDate(user.updated_at)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-text-primary opacity-60" />
              <h3 className="mt-2 text-sm font-medium text-text-primary">No users found</h3>
              <p className="mt-1 text-sm text-text-primary opacity-60">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No users have been registered yet.'}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-secondary-bg border border-error rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-error" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error">
                  Error Loading Users
                </h3>
                <div className="mt-2 text-sm text-text-primary opacity-80">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;