import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Product, User } from '../types/Product';

export interface DashboardStats {
  totalProducts: number;
  averageRating: number;
  licenseTypes: number;
  totalSales: number;
  featuredProducts: number;
  freeProducts: number;
  paidProducts: number;
  totalUsers: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    averageRating: 0,
    licenseTypes: 0,
    totalSales: 0,
    featuredProducts: 0,
    freeProducts: 0,
    paidProducts: 0,
    totalUsers: 1, // Placeholder
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = (products: Product[], userCount: number): DashboardStats => {
    const totalProducts = products.length;
    const averageRating = products.length > 0 
      ? products.reduce((sum, p) => sum + p.rating, 0) / products.length 
      : 0;
    const licenseTypes = new Set(products.map(p => p.license)).size;
    const totalSales = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const featuredProducts = products.filter(p => p.is_featured).length;
    const freeProducts = products.filter(p => p.price === 0).length;
    const paidProducts = products.filter(p => p.price > 0).length;

    return {
      totalProducts,
      averageRating,
      licenseTypes,
      totalSales,
      featuredProducts,
      freeProducts,
      paidProducts,
      totalUsers: userCount,
    };
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both products and users data
      const [products, users] = await Promise.all([
        apiService.getProducts(),
        apiService.getUsers().catch(() => []) // Fallback to empty array if users fetch fails
      ]);
      
      const calculatedStats = calculateStats(products, users.length);
      setStats(calculatedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};