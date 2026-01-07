# MongoDB to MySQL Migration Guide

## Prerequisites

1. **Install MySQL Server**
   - Download and install MySQL Server from https://dev.mysql.com/downloads/mysql/
   - Set up root password during installation
   - Start MySQL service

2. **Install MySQL Dependencies**
   ```bash
   cd register-api
   npm install mysql2
   ```

## Migration Steps

### Step 1: Configure MySQL Connection

1. Open `mysql-config.js`
2. Update the database configuration:
   ```javascript
   const dbConfig = {
     host: 'localhost',
     user: 'root',
     password: 'YOUR_MYSQL_PASSWORD', // Change this
     database: 'tapodhan_db',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
   };
   ```

### Step 2: Create MySQL Database

1. Open MySQL Command Line or MySQL Workbench
2. Create the database:
   ```sql
   CREATE DATABASE tapodhan_db;
   ```

### Step 3: Create Tables

Run the schema creation script:
```bash
node mysql-schema.js
```

This will create all necessary tables:
- users
- admins
- profiles
- businesses
- events
- event_images
- profile_requests
- business_requests

### Step 4: Migrate Existing Data (Optional)

If you have existing data in MongoDB:

1. Ensure MongoDB is running
2. Run the migration script:
   ```bash
   node migrate-data.js
   ```

This will:
- Connect to both MongoDB and MySQL
- Transfer all existing data
- Maintain relationships between tables
- Handle ID mapping from MongoDB ObjectIds to MySQL auto-increment IDs

### Step 5: Switch to MySQL Version

1. **Backup your current index.js:**
   ```bash
   copy index.js index-mongodb-backup.js
   ```

2. **Replace with MySQL version:**
   ```bash
   copy index-mysql.js index.js
   ```

3. **Update MySQL password in mysql-config.js**

### Step 6: Test the Application

1. **Start the server:**
   ```bash
   node index.js
   ```

2. **Test key endpoints:**
   - POST /register - User registration
   - POST /login - User login
   - POST /admin/login - Admin login
   - POST /profile - Profile creation
   - GET /profiles - Get profiles
   - POST /business - Business registration
   - GET /businesses - Get businesses
   - POST /events - Event creation
   - GET /events - Get events

## Key Differences Between MongoDB and MySQL Versions

### 1. **Data Types**
- MongoDB ObjectIds → MySQL AUTO_INCREMENT INT
- MongoDB flexible schemas → MySQL fixed schemas
- MongoDB arrays → MySQL separate tables (event_images)

### 2. **Relationships**
- MongoDB references → MySQL FOREIGN KEY constraints
- MongoDB populate() → MySQL JOINs

### 3. **Queries**
- MongoDB find() → MySQL SELECT
- MongoDB save() → MySQL INSERT/UPDATE
- MongoDB aggregation → MySQL complex queries

## File Structure After Migration

```
register-api/
├── index.js (MySQL version)
├── index-mongodb-backup.js (backup)
├── mysql-config.js (MySQL connection)
├── mysql-schema.js (table creation)
├── mysql-models.js (MySQL models)
├── migrate-data.js (migration script)
├── package.json (updated with mysql2)
└── uploads/ (unchanged)
```

## Troubleshooting

### Common Issues:

1. **Connection Error:**
   - Check MySQL service is running
   - Verify credentials in mysql-config.js
   - Ensure database exists

2. **Migration Errors:**
   - Check MongoDB is running
   - Verify data integrity
   - Check console for specific error messages

3. **Foreign Key Constraints:**
   - Ensure parent records exist before child records
   - Check ID mappings in migration

### Performance Considerations:

1. **Indexing:**
   - Add indexes on frequently queried columns
   - Email and mobile columns already have UNIQUE constraints

2. **Connection Pooling:**
   - MySQL connection pool is configured with 10 connections
   - Adjust based on your application load

## Rollback Plan

If you need to rollback to MongoDB:

1. **Restore original index.js:**
   ```bash
   copy index-mongodb-backup.js index.js
   ```

2. **Start MongoDB service**

3. **Your data in MongoDB remains unchanged**

## Benefits of MySQL Migration

1. **ACID Compliance:** Better data consistency
2. **Mature Ecosystem:** Extensive tooling and support
3. **Performance:** Optimized for relational queries
4. **Backup/Recovery:** Robust backup solutions
5. **Scaling:** Better horizontal scaling options
6. **Reporting:** Easier integration with BI tools

## Next Steps

1. **Add Indexes:** Create indexes on frequently queried columns
2. **Optimize Queries:** Use EXPLAIN to optimize slow queries
3. **Backup Strategy:** Set up regular database backups
4. **Monitoring:** Implement database monitoring
5. **Security:** Configure proper user permissions