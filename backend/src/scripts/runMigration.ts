import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🔄 Running database migration...');
    
    // First, check current column type
    console.log('📋 Checking current column structure...');
    const [currentStructure] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'main_image_url'
    `) as any;
    
    if (currentStructure.length > 0) {
      const column = currentStructure[0];
      console.log(`Current main_image_url type: ${column.DATA_TYPE}`);
      if (column.CHARACTER_MAXIMUM_LENGTH) {
        console.log(`Current max length: ${column.CHARACTER_MAXIMUM_LENGTH}`);
      }
      
      if (column.DATA_TYPE === 'longtext') {
        console.log('✅ Column is already LONGTEXT. No migration needed.');
        return;
      }
    }
    
    // Run the migration
    console.log('🔧 Updating main_image_url column to LONGTEXT...');
    await pool.execute('ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT');
    
    // Verify the change
    console.log('🔍 Verifying migration...');
    const [newStructure] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'main_image_url'
    `) as any;
    
    if (newStructure.length > 0) {
      const column = newStructure[0];
      console.log(`✅ Updated main_image_url type: ${column.DATA_TYPE}`);
      if (column.DATA_TYPE === 'longtext') {
        console.log('✅ Migration completed successfully!');
        console.log('📝 The main_image_url column now supports base64 images up to 4GB.');
      } else {
        throw new Error(`Migration failed: Column type is still ${column.DATA_TYPE}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n🔧 Manual fix: Run this SQL command in your database:');
    console.log('ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT;');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration };