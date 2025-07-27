import { pool, initializeDatabase } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: 'React UI Kit Pro',
    license: 'MIT',
    description: 'A comprehensive React component library with modern design patterns, TypeScript support, and extensive customization options.',
    rating: 5,
    price: 49.99,
    category: 'UI Components',
    main_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop'
    ],
    feature_1: '150+ Components',
    feature_2: 'TypeScript Support',
    feature_3: '8 Themes',
    feature_4: 'Responsive Design',
    feature_5: 'Dark Mode',
    requirements: 'React 18+, Node.js 16+',
    version: '2.1.0',
    file_size: '15.2 MB',
    download_count: 1250,
    is_featured: true,
    demo_url: 'https://react-ui-kit-demo.example.com',
    documentation_url: 'https://docs.react-ui-kit.example.com',
    support_email: 'support@react-ui-kit.example.com',
    tags: 'react, typescript, ui, components'
  },
  {
    name: 'Vue Dashboard Template',
    license: 'Commercial',
    description: 'Professional admin dashboard template built with Vue 3, featuring charts, tables, and responsive design.',
    rating: 4,
    price: 79.99,
    category: 'Templates',
    main_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
    ],
    feature_1: '25 Pages',
    feature_2: '12 Chart Types',
    feature_3: 'Responsive Layout',
    feature_4: 'Dark Mode',
    feature_5: 'Real-time Data',
    requirements: 'Vue 3+, Node.js 16+',
    version: '1.5.2',
    file_size: '8.7 MB',
    download_count: 890,
    is_featured: true,
    demo_url: 'https://vue-dashboard-demo.example.com',
    documentation_url: 'https://docs.vue-dashboard.example.com',
    support_email: 'support@vue-dashboard.example.com',
    tags: 'vue, dashboard, admin, charts'
  },
  {
    name: 'Node.js API Starter',
    license: 'Apache 2.0',
    description: 'Production-ready Node.js API boilerplate with authentication, database integration, and comprehensive testing.',
    rating: 5,
    price: 0.00,
    category: 'Backend',
    main_image_url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop'
    ],
    feature_1: 'JWT Authentication',
    feature_2: 'MongoDB Integration',
    feature_3: 'Jest Testing',
    feature_4: 'Swagger Documentation',
    feature_5: 'Docker Support',
    requirements: 'Node.js 18+, MongoDB 5+',
    version: '3.0.1',
    file_size: '2.1 MB',
    download_count: 2150,
    is_featured: false,
    demo_url: 'https://api-starter-demo.example.com',
    documentation_url: 'https://docs.api-starter.example.com',
    support_email: 'support@api-starter.example.com',
    tags: 'nodejs, api, backend, authentication'
  },
  {
    name: 'Mobile App Icons Pack',
    license: 'Creative Commons',
    description: 'Collection of 500+ high-quality mobile app icons in multiple formats and sizes.',
    rating: 4,
    price: 29.99,
    category: 'Mobile',
    main_image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
    ],
    feature_1: '500+ Icons',
    feature_2: 'Multiple Formats',
    feature_3: 'Vector Graphics',
    feature_4: 'Retina Ready',
    feature_5: 'Easy Customization',
    requirements: 'Any design software',
    version: '2.0.0',
    file_size: '45.8 MB',
    download_count: 567,
    is_featured: false,
    demo_url: 'https://icons-demo.example.com',
    documentation_url: 'https://docs.icons.example.com',
    support_email: 'support@icons.example.com',
    tags: 'icons, mobile, design, graphics'
  },
  {
    name: 'E-commerce Shopify Theme',
    license: 'Commercial',
    description: 'Modern and responsive Shopify theme designed for fashion and lifestyle brands.',
    rating: 5,
    price: 159.99,
    category: 'E-commerce',
    main_image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop'
    ],
    feature_1: 'Mobile Optimized',
    feature_2: 'SEO Friendly',
    feature_3: 'Fast Loading',
    feature_4: 'Multi-currency',
    feature_5: 'Social Integration',
    requirements: 'Shopify Store',
    version: '1.8.0',
    file_size: '12.3 MB',
    download_count: 423,
    is_featured: true,
    demo_url: 'https://shopify-theme-demo.example.com',
    documentation_url: 'https://docs.shopify-theme.example.com',
    support_email: 'support@shopify-theme.example.com',
    tags: 'shopify, ecommerce, theme, fashion'
  }
];

async function seedDatabase() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();

    console.log('Clearing existing products...');
    await pool.execute('DELETE FROM products');

    console.log('Inserting sample products...');
    for (const product of sampleProducts) {
      await pool.execute(
        `INSERT INTO products (
          name, license, description, rating, price, category,
          main_image_url, gallery_images, feature_1, feature_2, feature_3, feature_4, feature_5,
          requirements, version, file_size, download_count, is_featured,
          demo_url, documentation_url, support_email, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.license,
          product.description,
          product.rating,
          product.price,
          product.category,
          product.main_image_url,
          JSON.stringify(product.gallery_images),
          product.feature_1,
          product.feature_2,
          product.feature_3,
          product.feature_4,
          product.feature_5,
          product.requirements,
          product.version,
          product.file_size,
          product.download_count,
          product.is_featured,
          product.demo_url,
          product.documentation_url,
          product.support_email,
          product.tags
        ]
      );
    }

    console.log(`Successfully seeded ${sampleProducts.length} products!`);
    
    // Verify the data
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM products');
    console.log(`Total products in database: ${(rows as any)[0].count}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
