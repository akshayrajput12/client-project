import { Request, Response } from 'express';
import { pool } from '../config/database';
import { addToCartSchema, updateCartSchema } from '../validation/productValidation';
import { CartItem, AddToCartRequest, UpdateCartRequest } from '../types/Product';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT
        c.*,
        p.name as product_name,
        p.price as product_price,
        p.main_image_url as product_image,
        p.license as product_license,
        p.category as product_category
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [userId]);

    const cartItems = rows.map(row => ({
      id: row.id,
      user_id: row.user_id,
      product_id: row.product_id,
      quantity: row.quantity,
      created_at: row.created_at,
      updated_at: row.updated_at,
      product: {
        id: row.product_id,
        name: row.product_name,
        price: row.product_price,
        main_image_url: row.product_image,
        license: row.product_license,
        category: row.product_category
      }
    }));

    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = (req as any).user.userId;
    const { product_id, quantity }: AddToCartRequest = value;

    // Check if product exists
    const [productRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM products WHERE id = ?',
      [product_id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const [existingRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingRows.length > 0) {
      // Update quantity
      const existingItem = existingRows[0];
      const newQuantity = existingItem.quantity + quantity;

      await pool.execute(
        'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, existingItem.id]
      );

      res.json({ message: 'Cart updated successfully', quantity: newQuantity });
    } else {
      // Add new item
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );

      res.status(201).json({ 
        message: 'Item added to cart successfully', 
        cartItemId: result.insertId 
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { error, value } = updateCartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = (req as any).user.userId;
    const cartItemId = parseInt(req.params.id);
    const { quantity }: UpdateCartRequest = value;

    // Check if cart item exists and belongs to user
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Update quantity
    await pool.execute(
      'UPDATE cart SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, cartItemId]
    );

    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const cartItemId = parseInt(req.params.id);

    // Check if cart item exists and belongs to user
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM cart WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Remove item
    await pool.execute('DELETE FROM cart WHERE id = ?', [cartItemId]);

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear entire cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    await pool.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get cart summary (total items, total price)
export const getCartSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as total_items,
        SUM(c.quantity) as total_quantity,
        SUM(c.quantity * p.price) as total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);

    const summary = rows[0];

    res.json({
      total_items: parseInt(summary.total_items) || 0,
      total_quantity: parseInt(summary.total_quantity) || 0,
      total_price: parseFloat(summary.total_price) || 0
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
