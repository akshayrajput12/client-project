import { pool } from '../config/database';

async function fixImageColumn() {
  try {
    console.log('🔧 Fixing image column issue...');
    
    // Check current column type
    console.log('📋 Checking current column structure...');
    const [currentStructure] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'main_image_url'
    `) as any;
    
    if (currentStructure.length > 0) {
      const column = currentStructure[0];
      console.log(`📊 Current main_image_url type: ${column.DATA_TYPE}`);
      
      if (column.DATA_TYPE === 'longtext') {
        console.log('✅ Column is already LONGTEXT. Issue should be resolved.');
        console.log('🔍 If you\'re still getting errors, check your MySQL max_allowed_packet setting.');
        return;
      }
    } else {
      console.log('❌ products table or main_image_url column not found!');
      return;
    }
    
    // Apply the fix
    console.log('🔧 Updating main_image_url column to LONGTEXT...');
    await pool.execute('ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT');
    
    // Verify the fix
    console.log('🔍 Verifying the fix...');
    const [newStructure] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'main_image_url'
    `) as any;
    
    if (newStructure.length > 0 && newStructure[0].DATA_TYPE === 'longtext') {
      console.log('✅ SUCCESS! Column updated to LONGTEXT');
      console.log('🎉 Image uploads should now work properly');
      console.log('📝 You can now upload images up to 4GB in size');
    } else {
      console.log('❌ Fix failed - column type was not updated');
    }
    
  } catch (error: any) {
    console.error('❌ Error fixing column:', error);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('💡 Make sure the products table exists. Run the schema setup first.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Make sure your database user has ALTER privileges.');
    } else {
      console.log('💡 Try running this SQL command manually in your database:');
      console.log('   ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT;');
    }
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  fixImageColumn();
}

export { fixImageColumn };