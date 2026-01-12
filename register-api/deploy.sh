#!/bin/bash

# Production deployment script for register-api

echo "🚀 Starting production deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Set environment to production
echo "⚙️ Setting environment..."
cp .env.production .env

# Create database and import data
echo "🗄️ Setting up database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS tapodhan_db;"
node mysql-schema.js
mysql -u root -p tapodhan_db < database_export.sql

# Start application with PM2
echo "🔄 Starting application..."
npm install -g pm2
pm2 start index.js --name "tapodhan-api"
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "API running on port 3000"