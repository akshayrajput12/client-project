import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import productRoutes from './routes/products';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import adminRoutes from './routes/adminRoutes';
import { testConnection, initializeDatabase } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Allow cookies
}));
// Increase payload limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Product Catalog API is running' });
});

// Initialize database and start server
async function startServer() {
  try {
    await testConnection();
    console.log('✅ Database connection successful');

    await initializeDatabase();
    console.log('✅ Database initialized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`📋 Products API: http://localhost:${PORT}/api/products`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
      console.log(`👨‍💼 Admin API: http://localhost:${PORT}/api/admin`);
      console.log(`👤 Default Admin: admin@admin.com / admin123`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
