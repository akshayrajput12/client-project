import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ email, password });
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setEmail('admin@admin.com');
    setPassword('admin123');
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-secondary-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-primary opacity-70">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary-teal hover:text-secondary-teal"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary-bg placeholder-text-primary placeholder-opacity-60 text-text-primary bg-primary-bg rounded-t-md focus:outline-none focus:ring-primary-teal focus:border-primary-teal focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary-bg placeholder-text-primary placeholder-opacity-60 text-text-primary bg-primary-bg rounded-b-md focus:outline-none focus:ring-primary-teal focus:border-primary-teal focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-error text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-teal hover:bg-secondary-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleAdminLogin}
              className="text-sm text-primary-teal hover:text-secondary-teal"
            >
              Use Admin Credentials
            </button>
          </div>
        </form>

        <div className="mt-6 bg-secondary-bg border border-primary-teal rounded-md p-4">
          <h3 className="text-sm font-medium text-primary-teal mb-2">Demo Credentials:</h3>
          <div className="text-sm text-text-primary opacity-80">
            <p><strong>Admin:</strong> admin@admin.com / admin123</p>
            <p><strong>Regular User:</strong> Create a new account</p>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
