const { connectDB } = require('./mysql-config');
const fs = require('fs');

const exportDatabase = async () => {
  try {
    const pool = await connectDB();
    
    // Get all table data
    const tables = ['users', 'admins', 'profiles', 'businesses', 'business_requests', 'events', 'event_images'];
    let sqlDump = '';
    
    for (const table of tables) {
      const [rows] = await pool.execute(`SELECT * FROM ${table}`);
      
      if (rows.length > 0) {
        sqlDump += `-- Data for table ${table}\n`;
        
        for (const row of rows) {
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row).map(val => 
            val === null ? 'NULL' : 
            typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : 
            val instanceof Date ? `'${val.toISOString().slice(0, 19).replace('T', ' ')}'` :
            val
          ).join(', ');
          
          sqlDump += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
        }
        sqlDump += '\n';
      }
    }
    
    fs.writeFileSync('database_export.sql', sqlDump);
    console.log('✅ Database exported to database_export.sql');
    
  } catch (error) {
    console.error('Export error:', error);
  } finally {
    process.exit(0);
  }
};

exportDatabase();