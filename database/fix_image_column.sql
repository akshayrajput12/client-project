-- Direct fix for image upload issue
-- Run this SQL command directly in your MySQL database

-- Check current column type
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'products' 
AND COLUMN_NAME = 'main_image_url';

-- Update the column to LONGTEXT
ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT;

-- Verify the change
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'products' 
AND COLUMN_NAME = 'main_image_url';

-- Show success message
SELECT 'Migration completed! main_image_url is now LONGTEXT' as status;