import { Request, Response } from 'express';
import { pool } from '../config/database';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/Product';
import { validateCreateProduct, validateUpdateProduct } from '../validation/productValidation';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, license, rating, category, featured } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    // Add search filter
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Add license filter
    if (license) {
      query += ' AND license = ?';
      params.push(license);
    }

    // Add rating filter
    if (rating) {
      query += ' AND rating = ?';
      params.push(parseInt(rating as string));
    }

    // Add category filter
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Add featured filter
    if (featured) {
      query += ' AND is_featured = ?';
      params.push(featured === 'true');
    }

    query += ' ORDER BY is_featured DESC, created_at DESC';

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);

    // Parse JSON fields and ensure proper types for each product
    const products = rows.map(row => ({
      ...row,
      price: Number(row.price),
      rating: Number(row.rating),
      download_count: Number(row.download_count),
      is_featured: Boolean(row.is_featured),
      gallery_images: row.gallery_images ?
        (typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images) : row.gallery_images) : []
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Parse JSON fields and ensure proper types
    const product = {
      ...rows[0],
      price: Number(rows[0].price),
      rating: Number(rows[0].rating),
      download_count: Number(rows[0].download_count),
      is_featured: Boolean(rows[0].is_featured),
      gallery_images: rows[0].gallery_images ?
        (typeof rows[0].gallery_images === 'string' ? JSON.parse(rows[0].gallery_images) : rows[0].gallery_images) : []
    };

    // Increment download count
    await pool.execute(
      'UPDATE products SET download_count = download_count + 1 WHERE id = ?',
      [id]
    );

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = validateCreateProduct(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const {
      name,
      license,
      description,
      rating,
      price,
      category,
      main_image_url,
      gallery_images,
      feature_1,
      feature_2,
      feature_3,
      feature_4,
      feature_5,
      requirements,
      version,
      file_size,
      is_featured,
      demo_url,
      documentation_url,
      support_email,
      tags
    }: CreateProductRequest = value;

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (
        name, license, description, rating, price, category,
        main_image_url, gallery_images, feature_1, feature_2, feature_3, feature_4, feature_5,
        requirements, version, file_size, is_featured, demo_url, documentation_url, support_email, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        license,
        description,
        rating,
        price,
        category,
        main_image_url || null,
        gallery_images ? JSON.stringify(gallery_images) : null,
        feature_1 || null,
        feature_2 || null,
        feature_3 || null,
        feature_4 || null,
        feature_5 || null,
        requirements || null,
        version || null,
        file_size || null,
        is_featured || false,
        demo_url || null,
        documentation_url || null,
        support_email || null,
        tags || null
      ]
    );

    const [newProduct] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    // Parse JSON fields and ensure proper types
    const product = {
      ...newProduct[0],
      price: Number(newProduct[0].price),
      rating: Number(newProduct[0].rating),
      download_count: Number(newProduct[0].download_count),
      is_featured: Boolean(newProduct[0].is_featured),
      gallery_images: newProduct[0].gallery_images ?
        (typeof newProduct[0].gallery_images === 'string' ? JSON.parse(newProduct[0].gallery_images) : newProduct[0].gallery_images) : []
    };

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error, value } = validateUpdateProduct(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // Check if product exists
    const [existingProduct] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updates: string[] = [];
    const params: any[] = [];

    Object.entries(value).forEach(([key, val]) => {
      if (val !== undefined) {
        updates.push(`${key} = ?`);
        params.push(key === 'gallery_images' ? JSON.stringify(val) : val);
      }
    });

    if (updates.length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    params.push(id);

    await pool.execute(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const [updatedProduct] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    // Parse JSON gallery_images field and ensure proper types
    const product = {
      ...updatedProduct[0],
      price: Number(updatedProduct[0].price),
      rating: Number(updatedProduct[0].rating),
      download_count: Number(updatedProduct[0].download_count),
      is_featured: Boolean(updatedProduct[0].is_featured),
      gallery_images: updatedProduct[0].gallery_images ?
        (typeof updatedProduct[0].gallery_images === 'string' ? JSON.parse(updatedProduct[0].gallery_images) : updatedProduct[0].gallery_images) : []
    };

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
