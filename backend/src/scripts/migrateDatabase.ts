import { pool } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

async function migrateDatabase() {
  try {
    console.log('🔄 Starting database migration...');

    // Drop cart table first (due to foreign key constraint)
    console.log('Dropping cart table...');
    await pool.execute('DROP TABLE IF EXISTS cart');

    // Drop existing products table to recreate with new schema
    console.log('Dropping existing products table...');
    await pool.execute('DROP TABLE IF EXISTS products');

    // Recreate products table with new schema
    console.log('Creating products table with new schema...');
    await pool.execute(`
      CREATE TABLE products (
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

    // Recreate cart table
    console.log('Creating cart table...');
    await pool.execute(`
      CREATE TABLE cart (
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

    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    await pool.end();
  }
}

// Run the migration function
if (require.main === module) {
  migrateDatabase();
}

export { migrateDatabase };
