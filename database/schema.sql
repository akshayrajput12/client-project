-- Product Catalog Database Schema
-- This file contains the complete database schema for the Product Catalog Application

-- Create database (uncomment if creating a new database)
-- CREATE DATABASE product_catalog;
-- USE product_catalog;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_admin (is_admin)
);

-- Categories table for product categorization
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Products table with enhanced schema
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license VARCHAR(255) NOT NULL,
  description TEXT,
  rating TINYINT CHECK (rating >= 1 AND rating <= 5),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  category VARCHAR(255) NOT NULL,
  
  -- Image fields
  main_image_url TEXT,
  gallery_images JSON,
  
  -- Feature fields (separate instead of JSON for easier admin input)
  feature_1 VARCHAR(255),
  feature_2 VARCHAR(255),
  feature_3 VARCHAR(255),
  feature_4 VARCHAR(255),
  feature_5 VARCHAR(255),
  
  -- Technical details
  requirements TEXT,
  version VARCHAR(50),
  file_size VARCHAR(50),
  download_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Additional URLs and contact
  demo_url VARCHAR(500),
  documentation_url VARCHAR(500),
  support_email VARCHAR(255),
  tags VARCHAR(500),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes for better performance
  INDEX idx_category (category),
  INDEX idx_rating (rating),
  INDEX idx_price (price),
  INDEX idx_featured (is_featured),
  INDEX idx_name (name),
  FULLTEXT idx_search (name, description, tags)
);

-- Cart table for shopping cart functionality
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraints
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  
  -- Unique constraint to prevent duplicate cart items
  UNIQUE KEY unique_user_product (user_id, product_id),
  
  -- Indexes
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (email, password, is_admin) VALUES 
('admin@admin.com', 'admin123', TRUE);

-- Insert default categories
INSERT IGNORE INTO categories (name, description) VALUES 
('Support', 'Support and assistance related products'),
('Core', 'Core functionality and essential components'),
('In-Dataspace Enablement', 'Products that enable functionality within a dataspace'),
('Inter Dataspace enablement', 'Products that enable functionality between dataspaces');

-- Create a view for products with category information
CREATE OR REPLACE VIEW products_with_category AS
SELECT 
  p.*,
  c.description as category_description
FROM products p
LEFT JOIN categories c ON p.category = c.name;

-- Create a view for cart items with product details
CREATE OR REPLACE VIEW cart_with_products AS
SELECT 
  c.*,
  p.name as product_name,
  p.price as product_price,
  p.main_image_url as product_image,
  (c.quantity * p.price) as total_price
FROM cart c
JOIN products p ON c.product_id = p.id;
