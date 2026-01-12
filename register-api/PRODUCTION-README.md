# Tapodhan Brahman Samaj API - Production Deployment

## 📋 Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- PM2 (for process management)

## 🚀 Deployment Steps

### 1. Upload Files
Upload the entire `register-api` folder to your server.

### 2. Configure Environment
Edit `.env.production` with your production settings:
```bash
MYSQL_PASSWORD=your_actual_mysql_password
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your_secure_jwt_secret
```

### 3. Run Deployment Script
```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Manual Setup (Alternative)
```bash
# Install dependencies
npm install --production

# Setup environment
cp .env.production .env

# Create database
mysql -u root -p -e "CREATE DATABASE tapodhan_db;"

# Create tables
node mysql-schema.js

# Import data
mysql -u root -p tapodhan_db < database_export.sql

# Start with PM2
pm2 start index.js --name "tapodhan-api"
pm2 save
pm2 startup
```

## 📁 Files Included
- `index.js` - Main application
- `mysql-config.js` - Database configuration
- `mysql-schema.js` - Database schema
- `mysql-models.js` - Database models
- `database_export.sql` - Database dump
- `.env.production` - Production environment
- `package.json` - Dependencies
- `uploads/` - File upload directory

## 🔧 Production URLs
- API Base: `https://tbsapi.trajinfotech.com`
- Admin Login: `POST /admin/login`
- User Registration: `POST /register`

## 📊 Database Tables
- users
- admins  
- profiles
- businesses
- business_requests
- events
- event_images

## 🛠️ Management Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs tapodhan-api

# Restart
pm2 restart tapodhan-api

# Stop
pm2 stop tapodhan-api
```

## 🔐 Super Admin Credentials
- Email: super@gmail.com
- Password: Su@12345

## 📝 Notes
- Change default passwords before deployment
- Configure SSL certificate for HTTPS
- Set up regular database backups
- Monitor application logs