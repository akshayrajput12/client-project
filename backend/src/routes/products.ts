import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { requireAdmin } from '../controllers/authController';

const router = express.Router();

// GET /api/products - Get all products with optional filters (public)
router.get('/', getAllProducts);

// GET /api/products/:id - Get product by ID (public)
router.get('/:id', getProductById);

// POST /api/products - Create new product (admin only)
router.post('/', requireAdmin, createProduct);

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', requireAdmin, updateProduct);

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', requireAdmin, deleteProduct);

export default router;
