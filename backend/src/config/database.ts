import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
}

// Initialize database tables
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔧 Initializing database...');

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create enhanced products table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        license VARCHAR(255) NOT NULL,
        description TEXT,
        rating TINYINT CHECK (rating >= 1 AND rating <= 5),
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        category VARCHAR(255) NOT NULL,
        main_image_url TEXT,
        gallery_images JSON,
        feature_1 VARCHAR(255),
        feature_2 VARCHAR(255),
        feature_3 VARCHAR(255),
        feature_4 VARCHAR(255),
        feature_5 VARCHAR(255),
        requirements TEXT,
        version VARCHAR(50),
        file_size VARCHAR(50),
        download_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        demo_url VARCHAR(500),
        documentation_url VARCHAR(500),
        support_email VARCHAR(255),
        tags VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_rating (rating),
        INDEX idx_price (price),
        INDEX idx_featured (is_featured)
      )
    `);

    // Create cart table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);

    // Insert default admin user if not exists
    await pool.execute(`
      INSERT IGNORE INTO users (email, password, is_admin)
      VALUES ('admin@admin.com', 'admin123', TRUE)
    `);

    // Insert default categories if not exist
    const defaultCategories = [
      'UI Kits', 'Templates', 'Icons', 'Fonts', 'Graphics',
      'Code Libraries', 'Plugins', 'Themes', 'Tools', 'Other'
    ];

    for (const category of defaultCategories) {
      await pool.execute(`
        INSERT IGNORE INTO categories (name, description)
        VALUES (?, ?)
      `, [category, `${category} category for products`]);
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
