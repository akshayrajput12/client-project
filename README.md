# Product Catalog Application

A full-stack web application for browsing and managing a catalog of products with user-facing features and admin functionality.

## 🚀 Features

### User Features
- **Product Browsing**: View all products with beautiful cards showing images, ratings, and pricing
- **Product Details**: Detailed product pages with image galleries, features, and specifications
- **Search & Filter**: Search products by name and filter by category, license, and rating
- **Shopping Cart**: Add products to cart, view cart items, and manage quantities
- **User Authentication**: Register and login to access cart functionality

### Admin Features
- **Product Management**: Full CRUD operations for products
- **Image Upload**: Upload product images directly from local storage
- **User-Friendly Forms**: Separate fields for all product information (no JSON required)
- **Dashboard**: Admin panel with easy-to-use interface

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for modern, responsive styling
- **React Router DOM** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MySQL** database with connection pooling
- **Joi** for request validation
- **Cookie-based authentication** (session management)

### Database
- **MySQL 8.0+** (supports both cloud and local setup)
- **Aiven Cloud MySQL** (configured for production)
- **Local MySQL** support with detailed setup guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **MySQL** (v8.0 or higher) - See [MySQL Setup Guide](docs/MySQL_Setup_Guide.md)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd product-catalog-app
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=your-mysql-host
DB_PORT=3306
DB_NAME=your-database-name
DB_USER=your-username
DB_PASS=your-password

# Server Configuration
PORT=5500
NODE_ENV=development
```

**For Local MySQL Setup:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=product_catalog
DB_USER=root
DB_PASS=your-root-password
```

### 4. Database Setup

#### Option A: Using Provided SQL Files (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the schema creation
mysql -u your-username -p your-database-name < ../database/schema.sql

# Seed with sample data
mysql -u your-username -p your-database-name < ../database/sample_data.sql
```

#### Option B: Using Migration Scripts

```bash
# Navigate to backend directory
cd backend

# Run database migration
npm run migrate

# Seed the database
npm run seed
```

### 5. Start the Application

#### Development Mode (Recommended)

```bash
# Terminal 1: Start Backend Server
cd backend
npm run dev

# Terminal 2: Start Frontend Development Server
cd frontend
npm run dev
```

#### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend server
cd ../backend
npm start
```

## 🔗 Application URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👤 Default Admin Credentials

```
Email: admin@admin.com
Password: admin123
```

## 📁 Project Structure

```
product-catalog-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── scripts/        # Database scripts
│   │   ├── types/          # TypeScript interfaces
│   │   └── validation/     # Request validation schemas
│   └── package.json
├── database/               # Database setup files
│   ├── schema.sql         # Complete database schema
│   └── sample_data.sql    # Sample products data
├── docs/                  # Documentation
│   └── MySQL_Setup_Guide.md
└── README.md
```

## 🗄 Database Schema

### Products Table
- Enhanced schema with separate fields for better admin usability
- Individual feature fields (feature_1 through feature_5)
- Image support with main_image_url and gallery_images
- Technical specifications and metadata fields

### Users Table
- Simple email/password authentication
- Admin role support
- Session management

### Cart Table
- User-specific cart items
- Quantity management
- Foreign key relationships

## 🔧 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to JavaScript
npm start           # Start production server
npm run migrate     # Run database migration (required for image uploads)
npm run seed        # Seed database with sample data
```

### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean, attractive design with smooth animations
- **Image Support**: Product image galleries and thumbnails
- **Interactive Elements**: Hover effects, loading states, and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔐 Authentication

- **Session-based Authentication**: Simple cookie-based sessions
- **Admin Protection**: Admin-only routes and functionality
- **User Registration**: New user signup with validation
- **Password Security**: Secure password handling

## 📱 API Endpoints

### Products
- `GET /api/products` - Get all products with optional filters
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

## 🚀 Quick Setup

### First Time Setup
1. **Database Setup**: Follow the [MySQL Setup Guide](docs/MySQL_Setup_Guide.md)
2. **Run Migration**: `cd backend && npm run migrate` (required for image uploads)
3. **Seed Data**: `cd backend && npm run seed` (optional sample data)
4. **Start Backend**: `cd backend && npm run dev`
5. **Start Frontend**: `cd frontend && npm run dev`

### Upgrading from Previous Version
If you're upgrading and getting image upload errors:
```bash
cd backend
npm run migrate
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL server is running
   - Check database credentials in `.env` file
   - Ensure database exists and is accessible

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes: `lsof -ti:5500 | xargs kill -9`

3. **TypeScript Compilation Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for missing type definitions

4. **Frontend Build Issues**
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

5. **Image Upload Errors**
   - "Data too long for column 'main_image_url'": Run `npm run migrate` in backend folder
   - "File size too large": Compress images to under 5MB or use image URLs
   - See [Image Upload Setup Guide](docs/IMAGE_UPLOAD_SETUP.md) for detailed troubleshooting

## 📚 Additional Documentation

- [MySQL Setup Guide](docs/MySQL_Setup_Guide.md) - Detailed local MySQL setup instructions
- [Image Upload Setup](docs/IMAGE_UPLOAD_SETUP.md) - Image upload configuration and troubleshooting
- [Database Schema](database/schema.sql) - Complete database structure
- [Sample Data](database/sample_data.sql) - Example products for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the MySQL setup guide for database issues

---

**Happy Coding! 🎉**