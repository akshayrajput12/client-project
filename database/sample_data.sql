-- Sample Data for Product Catalog Application
-- This file contains sample products to populate the database

-- Clear existing products (optional - remove if you want to keep existing data)
-- DELETE FROM products;

-- Insert sample products
INSERT INTO products (
  name, license, description, rating, price, category,
  main_image_url, gallery_images, 
  feature_1, feature_2, feature_3, feature_4, feature_5,
  requirements, version, file_size, download_count, is_featured,
  demo_url, documentation_url, support_email, tags
) VALUES 

-- Product 1: React UI Kit Pro
(
  'React UI Kit Pro',
  'MIT',
  'A comprehensive React component library with modern design patterns, TypeScript support, and extensive customization options.',
  5,
  49.99,
  'UI Components',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'
  ),
  '150+ Components',
  'TypeScript Support',
  '8 Themes',
  'Responsive Design',
  'Dark Mode',
  'React 18+, Node.js 16+',
  '2.1.0',
  '15.2 MB',
  1250,
  TRUE,
  'https://react-ui-kit-demo.example.com',
  'https://docs.react-ui-kit.example.com',
  'support@react-ui-kit.example.com',
  'react, typescript, ui, components'
),

-- Product 2: Vue Dashboard Template
(
  'Vue Dashboard Template',
  'Commercial',
  'Professional admin dashboard template built with Vue 3, featuring charts, tables, and responsive design.',
  4,
  79.99,
  'Templates',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
  ),
  '25 Pages',
  '12 Chart Types',
  'Responsive Layout',
  'Dark Mode',
  'Real-time Data',
  'Vue 3+, Node.js 16+',
  '1.5.2',
  '8.7 MB',
  890,
  TRUE,
  'https://vue-dashboard-demo.example.com',
  'https://docs.vue-dashboard.example.com',
  'support@vue-dashboard.example.com',
  'vue, dashboard, admin, charts'
),

-- Product 3: Node.js API Starter
(
  'Node.js API Starter',
  'Apache 2.0',
  'Production-ready Node.js API boilerplate with authentication, database integration, and comprehensive testing.',
  5,
  0.00,
  'Backend',
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop'
  ),
  'JWT Authentication',
  'MongoDB Integration',
  'Jest Testing',
  'Swagger Documentation',
  'Docker Support',
  'Node.js 18+, MongoDB 5+',
  '3.0.1',
  '2.1 MB',
  2150,
  FALSE,
  'https://api-starter-demo.example.com',
  'https://docs.api-starter.example.com',
  'support@api-starter.example.com',
  'nodejs, api, backend, authentication'
),

-- Product 4: Mobile App Icons Pack
(
  'Mobile App Icons Pack',
  'Creative Commons',
  'Collection of 500+ high-quality mobile app icons in multiple formats and sizes.',
  4,
  29.99,
  'Mobile',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
  ),
  '500+ Icons',
  'Multiple Formats',
  'Vector Graphics',
  'Retina Ready',
  'Easy Customization',
  'Any design software',
  '2.0.0',
  '45.8 MB',
  567,
  FALSE,
  'https://icons-demo.example.com',
  'https://docs.icons.example.com',
  'support@icons.example.com',
  'icons, mobile, design, graphics'
),

-- Product 5: E-commerce Shopify Theme
(
  'E-commerce Shopify Theme',
  'Commercial',
  'Modern and responsive Shopify theme designed for fashion and lifestyle brands.',
  5,
  159.99,
  'E-commerce',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
  ),
  'Mobile Optimized',
  'SEO Friendly',
  'Fast Loading',
  'Multi-currency',
  'Social Integration',
  'Shopify Store',
  '1.8.0',
  '12.3 MB',
  423,
  TRUE,
  'https://shopify-theme-demo.example.com',
  'https://docs.shopify-theme.example.com',
  'support@shopify-theme.example.com',
  'shopify, ecommerce, theme, fashion'
),

-- Product 6: Angular Material Dashboard
(
  'Angular Material Dashboard',
  'MIT',
  'Clean and modern Angular dashboard built with Material Design components.',
  4,
  89.99,
  'Templates',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'
  ),
  'Material Design',
  'Responsive Layout',
  'Data Tables',
  'Charts Integration',
  'Authentication',
  'Angular 15+, Node.js 16+',
  '2.3.1',
  '11.4 MB',
  756,
  FALSE,
  'https://angular-dashboard-demo.example.com',
  'https://docs.angular-dashboard.example.com',
  'support@angular-dashboard.example.com',
  'angular, material, dashboard, admin'
),

-- Product 7: Python FastAPI Boilerplate
(
  'Python FastAPI Boilerplate',
  'MIT',
  'Modern Python API framework boilerplate with async support, automatic documentation, and type hints.',
  5,
  0.00,
  'Backend',
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop'
  ),
  'Async Support',
  'Auto Documentation',
  'Type Hints',
  'Database Integration',
  'Testing Setup',
  'Python 3.8+, PostgreSQL',
  '1.2.0',
  '3.7 MB',
  1834,
  TRUE,
  'https://fastapi-demo.example.com',
  'https://docs.fastapi-boilerplate.example.com',
  'support@fastapi-boilerplate.example.com',
  'python, fastapi, backend, async'
),

-- Product 8: Flutter UI Components
(
  'Flutter UI Components',
  'BSD-3-Clause',
  'Beautiful Flutter UI components collection with customizable themes and animations.',
  4,
  39.99,
  'Mobile',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
  JSON_ARRAY(
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
  ),
  '80+ Components',
  'Custom Animations',
  'Theme Support',
  'Cross Platform',
  'Well Documented',
  'Flutter 3.0+, Dart 2.17+',
  '1.4.2',
  '8.9 MB',
  692,
  FALSE,
  'https://flutter-ui-demo.example.com',
  'https://docs.flutter-ui.example.com',
  'support@flutter-ui.example.com',
  'flutter, mobile, ui, components'
);

-- Verify the inserted data
SELECT COUNT(*) as total_products FROM products;
SELECT category, COUNT(*) as count FROM products GROUP BY category;
SELECT name, price, is_featured FROM products ORDER BY is_featured DESC, price DESC;
