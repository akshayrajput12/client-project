# MySQL Database Setup Guide

This guide will help you set up MySQL locally for the Product Catalog Application. You can use either MySQL Workbench (recommended for beginners) or command line tools.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Option 1: Setup with MySQL Workbench (Recommended)](#option-1-setup-with-mysql-workbench-recommended)
3. [Option 2: Setup with Command Line](#option-2-setup-with-command-line)
4. [Option 3: Setup with XAMPP](#option-3-setup-with-xampp)
5. [Connecting the Application](#connecting-the-application)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Download and Install MySQL
1. **Download MySQL Community Server**
   - Visit: https://dev.mysql.com/downloads/mysql/
   - Choose your operating system
   - Download the installer

2. **Download MySQL Workbench** (Optional but recommended)
   - Visit: https://dev.mysql.com/downloads/workbench/
   - Download and install MySQL Workbench

### Installation Notes
- **Windows**: Use the MySQL Installer which includes both MySQL Server and Workbench
- **macOS**: Download the DMG file and follow the installation wizard
- **Linux**: Use your package manager (apt, yum, etc.) or download the TAR file

**Important**: Remember the root password you set during installation!

## Option 1: Setup with MySQL Workbench (Recommended)

### Step 1: Connect to MySQL
1. Open MySQL Workbench
2. Click on the "+" icon to create a new connection
3. Fill in the connection details:
   - **Connection Name**: `Product Catalog Local`
   - **Hostname**: `127.0.0.1` or `localhost`
   - **Port**: `3306` (default)
   - **Username**: `root`
   - **Password**: (the password you set during installation)
4. Click "Test Connection" to verify
5. Click "OK" to save the connection

### Step 2: Create Database
1. Double-click on your connection to open it
2. In the query editor, run:
```sql
CREATE DATABASE product_catalog;
USE product_catalog;
```

### Step 3: Import Schema
1. Go to **Server** → **Data Import**
2. Select **Import from Self-Contained File**
3. Browse and select `database/schema.sql` from your project folder
4. Under **Default Target Schema**, select `product_catalog`
5. Click **Start Import**

### Step 4: Import Sample Data
1. Open a new query tab
2. Go to **File** → **Open SQL Script**
3. Select `database/sample_data.sql` from your project folder
4. Click the lightning bolt icon to execute
5. Verify data was imported by running:
```sql
SELECT COUNT(*) FROM products;
```

## Option 2: Setup with Command Line

### Step 1: Connect to MySQL
```bash
# Connect to MySQL as root
mysql -u root -p
# Enter your password when prompted
```

### Step 2: Create Database and User
```sql
-- Create database
CREATE DATABASE product_catalog;

-- Create a user for the application (optional but recommended)
CREATE USER 'catalog_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON product_catalog.* TO 'catalog_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE product_catalog;
```

### Step 3: Import Schema
```bash
# Exit MySQL first
exit

# Import schema file
mysql -u root -p product_catalog < database/schema.sql
```

### Step 4: Import Sample Data
```bash
# Import sample data
mysql -u root -p product_catalog < database/sample_data.sql
```

### Step 5: Verify Installation
```bash
# Connect back to MySQL
mysql -u root -p product_catalog

# Check if tables were created
SHOW TABLES;

# Check if data was imported
SELECT COUNT(*) FROM products;
```

## Option 3: Setup with XAMPP

### Step 1: Install XAMPP
1. Download XAMPP from: https://www.apachefriends.org/
2. Install XAMPP with MySQL component
3. Start the XAMPP Control Panel
4. Start the **MySQL** service

### Step 2: Access phpMyAdmin
1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. Login (usually no password required for local XAMPP)

### Step 3: Create Database
1. Click **New** in the left sidebar
2. Enter database name: `product_catalog`
3. Click **Create**

### Step 4: Import Schema
1. Select the `product_catalog` database
2. Click the **Import** tab
3. Click **Choose File** and select `database/schema.sql`
4. Click **Go**

### Step 5: Import Sample Data
1. Click the **Import** tab again
2. Click **Choose File** and select `database/sample_data.sql`
3. Click **Go**

## Connecting the Application

### Update Environment Variables
Create or update the `.env` file in your `backend` folder:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=product_catalog
DB_USER=root
DB_PASS=your_mysql_password

# Or if you created a specific user:
# DB_USER=catalog_user
# DB_PASS=your_password_here

# Server Configuration
PORT=5000
```

### Test the Connection
1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

4. You should see:
```
Server running on port 5000
Database connected successfully
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Access denied for user 'root'@'localhost'"
- **Solution**: Check your password or reset the MySQL root password
- **Reset password**: Use MySQL installer or run `mysqladmin -u root password newpassword`

#### 2. "Can't connect to MySQL server"
- **Solution**: Make sure MySQL service is running
- **Windows**: Check Services or use MySQL Installer
- **macOS/Linux**: Run `sudo systemctl start mysql` or `brew services start mysql`

#### 3. "Unknown database 'product_catalog'"
- **Solution**: Make sure you created the database first:
```sql
CREATE DATABASE product_catalog;
```

#### 4. "Table doesn't exist"
- **Solution**: Import the schema file first before importing sample data

#### 5. Port 3306 already in use
- **Solution**: Either stop the conflicting service or change the MySQL port in `my.cnf`

### Checking MySQL Status

#### Windows
```cmd
# Check if MySQL is running
net start | findstr MySQL

# Start MySQL service
net start MySQL80  # (or your MySQL service name)
```

#### macOS/Linux
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Or with Homebrew on macOS
brew services list | grep mysql
brew services start mysql
```

### Default Credentials
After setup, you can use these default credentials to test the application:

**Admin User:**
- Email: `admin@admin.com`
- Password: `admin123`

**Database:**
- Host: `localhost`
- Port: `3306`
- Database: `product_catalog`
- User: `root` (or the user you created)

## Next Steps

1. **Start the Application**: Follow the main README to start both frontend and backend
2. **Test Admin Features**: Login with admin credentials to add/edit products
3. **Customize**: Modify the sample data or add your own products
4. **Backup**: Regularly backup your database using MySQL Workbench or mysqldump

For more help, refer to the main project documentation or contact support.
