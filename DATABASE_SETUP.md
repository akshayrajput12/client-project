# Database Setup Guide

This guide will help you set up a MySQL database for the Product Catalog Application.

## Option 1: Free Online MySQL Database (Recommended for School Projects)

### 1. PlanetScale (Free Tier)
1. Go to [PlanetScale](https://planetscale.com/)
2. Sign up for a free account
3. Create a new database
4. Get connection details from the dashboard
5. Use the connection string format

### 2. Railway (Free Tier)
1. Go to [Railway](https://railway.app/)
2. Sign up with GitHub
3. Create a new project
4. Add MySQL service
5. Get connection details from the Variables tab

### 3. Aiven (Free Tier)
1. Go to [Aiven](https://aiven.io/)
2. Sign up for free account
3. Create MySQL service
4. Download SSL certificate if required
5. Get connection details

## Option 2: Local MySQL Setup

### Install MySQL locally:
```bash
# Windows (using Chocolatey)
choco install mysql

# macOS (using Homebrew)
brew install mysql

# Ubuntu/Debian
sudo apt-get install mysql-server
```

### Create database:
```sql
CREATE DATABASE products_db;
CREATE USER 'db_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON products_db.* TO 'db_user'@'localhost';
FLUSH PRIVILEGES;
```

## Environment Configuration

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=your-database-host
DB_PORT=3306
DB_NAME=products_db
DB_USER=your-username
DB_PASS=your-password

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional API Key for security
API_KEY=your_api_key_here
```

## Database Schema

The application will automatically create the following table:

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  license VARCHAR(255) NOT NULL,
  description TEXT,
  rating TINYINT CHECK (rating >= 1 AND rating <= 5),
  extras JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Sample Data

To populate the database with sample data, run:
```bash
cd backend
npm run seed
```

This will create 5 sample products with different licenses, ratings, and extras.

## Testing the Connection

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Check the health endpoint:
```bash
curl http://localhost:5000/api/health
```

3. Get all products:
```bash
curl http://localhost:5000/api/products
```

## Troubleshooting

### Connection Issues
- Verify your database credentials
- Check if the database server is running
- Ensure your IP is whitelisted (for cloud databases)
- Check firewall settings

### SSL Issues
- Some cloud providers require SSL connections
- Add SSL configuration to the database config if needed

### Permission Issues
- Ensure the database user has proper permissions
- Check if the database exists and is accessible

## Security Notes

- Never commit your `.env` file to version control
- Use strong passwords for database users
- Consider using connection pooling for production
- Implement rate limiting for API endpoints
- Use HTTPS in production
