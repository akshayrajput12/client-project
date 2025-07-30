-- Migration: Update image URL columns to support base64 encoded images
-- This migration updates the main_image_url column from TEXT to LONGTEXT
-- to support base64 encoded images which can be very large

-- Update main_image_url column to LONGTEXT
ALTER TABLE products MODIFY COLUMN main_image_url LONGTEXT;

-- Note: gallery_images is already JSON which can handle large data
-- but if you need to store base64 images in JSON, ensure your MySQL 
-- max_allowed_packet is set appropriately (default is usually sufficient)

-- Verify the change
DESCRIBE products;