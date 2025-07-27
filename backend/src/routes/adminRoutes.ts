import express from 'express';
import { pool } from '../config/database';
import { requireAuth, requireAdmin } from '../controllers/authController';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Interface for User data
interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// GET /api/admin/users - Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT id, email, is_admin, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Get user stats
    const [userStats] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total_users, SUM(is_admin) as admin_users FROM users'
    );

    // Get product stats
    const [productStats] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total_products, AVG(rating) as avg_rating, SUM(is_featured) as featured_products FROM products'
    );

    // Get recent activity (last 30 days)
    const [recentUsers] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as recent_users FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    const [recentProducts] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as recent_products FROM products WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    res.json({
      users: {
        total: userStats[0].total_users,
        admins: userStats[0].admin_users,
        regular: userStats[0].total_users - userStats[0].admin_users,
        recent: recentUsers[0].recent_users
      },
      products: {
        total: productStats[0].total_products,
        featured: productStats[0].featured_products,
        avgRating: parseFloat(productStats[0].avg_rating || 0).toFixed(1),
        recent: recentProducts[0].recent_products
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch admin statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;