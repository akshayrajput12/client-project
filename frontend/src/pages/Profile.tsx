import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import {
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Access Denied</h2>
            <p className="text-text-primary opacity-70">Please log in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-secondary-bg py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-primary-bg shadow rounded-lg mb-6 border border-secondary-bg">
            <div className="px-6 py-4 border-b border-secondary-bg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-teal rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
                  <p className="text-text-primary opacity-70">Manage your account information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-primary-bg shadow rounded-lg border border-secondary-bg">
            <div className="px-6 py-4 border-b border-secondary-bg">
              <h2 className="text-lg font-semibold text-text-primary">Account Information</h2>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-secondary-bg rounded-lg bg-secondary-bg text-text-primary cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-sm text-text-primary opacity-60">
                  Your email address cannot be changed
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <KeyIcon className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value="••••••••••••"
                    disabled
                    className="w-full px-4 py-3 pr-12 border border-secondary-bg rounded-lg bg-secondary-bg text-text-primary cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-text-primary opacity-60" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-text-primary opacity-60" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-text-primary opacity-60">
                  Password is hidden for security
                </p>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Account Type
                </label>
                <div className="px-4 py-3 border border-secondary-bg rounded-lg bg-secondary-bg">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.is_admin 
                      ? 'bg-secondary-teal text-white' 
                      : 'bg-primary-teal text-white'
                  }`}>
                    {user.is_admin ? 'Administrator' : 'Regular User'}
                  </span>
                </div>
              </div>

              {/* Account Created */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Member Since
                </label>
                <div className="px-4 py-3 border border-secondary-bg rounded-lg bg-secondary-bg text-text-primary">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown'}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-secondary-bg border border-primary-teal rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <UserIcon className="h-5 w-5 text-primary-teal" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-teal">
                  Profile Information
                </h3>
                <div className="mt-2 text-sm text-text-primary opacity-80">
                  <p>
                    This is a read-only view of your profile information. 
                    Contact an administrator if you need to make changes to your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;