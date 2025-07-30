import { pool } from '../config/database';

async function diagnoseImageIssue() {
  try {
    console.log('🔍 Diagnosing image upload issue...\n');
    
    // 1. Check if products table exists
    console.log('1️⃣ Checking if products table exists...');
    const [tables] = await pool.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'products'
    `) as any;
    
    if (tables.length === 0) {
      console.log('❌ Products table does not exist!');
      console.log('💡 Run the database schema setup first.');
      return;
    }
    console.log('✅ Products table exists');
    
    // 2. Check main_image_url column structure
    console.log('\n2️⃣ Checking main_image_url column structure...');
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'main_image_url'
    `) as any;
    
    if (columns.length === 0) {
      console.log('❌ main_image_url column does not exist!');
      return;
    }
    
    const column = columns[0];
    console.log(`📊 Column type: ${column.DATA_TYPE}`);
    console.log(`📏 Max length: ${column.CHARACTER_MAXIMUM_LENGTH || 'unlimited'}`);
    console.log(`🔓 Nullable: ${column.IS_NULLABLE}`);
    
    if (column.DATA_TYPE !== 'longtext') {
      console.log('⚠️  Column is not LONGTEXT - this is the problem!');
      console.log('🔧 Need to run: ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT;');
    } else {
      console.log('✅ Column type is correct (LONGTEXT)');
    }
    
    // 3. Check MySQL max_allowed_packet setting
    console.log('\n3️⃣ Checking MySQL max_allowed_packet setting...');
    const [packetSize] = await pool.execute(`SHOW VARIABLES LIKE 'max_allowed_packet'`) as any;
    
    if (packetSize.length > 0) {
      const maxPacket = parseInt(packetSize[0].Value);
      const maxPacketMB = Math.round(maxPacket / (1024 * 1024));
      console.log(`📦 max_allowed_packet: ${maxPacketMB}MB`);
      
      if (maxPacketMB < 16) {
        console.log('⚠️  max_allowed_packet is quite small for large images');
        console.log('💡 Consider increasing it in MySQL config: max_allowed_packet=64M');
      } else {
        console.log('✅ max_allowed_packet size looks good');
      }
    }
    
    // 4. Test a small base64 image
    console.log('\n4️⃣ Testing with a small base64 image...');
    const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    try {
      await pool.execute(
        'SELECT ? as test_image',
        [testBase64]
      );
      console.log('✅ Small base64 image test passed');
    } catch (error: any) {
      console.log('❌ Small base64 image test failed:', error.message);
    }
    
    // 5. Summary and recommendations
    console.log('\n📋 SUMMARY:');
    if (column.DATA_TYPE !== 'longtext') {
      console.log('🔧 REQUIRED FIX: Update column type to LONGTEXT');
      console.log('   Run: npm run fix-images');
      console.log('   Or manually: ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT;');
    } else {
      console.log('✅ Database schema looks correct');
      console.log('💡 If still getting errors, the image might be too large');
      console.log('   Try using smaller images or image URLs instead');
    }
    
  } catch (error: any) {
    console.error('❌ Diagnosis failed:', error);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Database connection issue. Check your .env file credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Cannot connect to database. Make sure MySQL is running.');
    }
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  diagnoseImageIssue();
}

export { diagnoseImageIssue };