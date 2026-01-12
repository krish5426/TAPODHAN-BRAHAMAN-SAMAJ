const { connectDB } = require('./mysql-config');

const updateEventsSchema = async () => {
  const pool = await connectDB();
  
  try {
    // Rename existing image column to posterImage
    await pool.execute(`ALTER TABLE events CHANGE COLUMN image posterImage VARCHAR(255)`);
    
    // Recreate event_images table for multiple images per event
    await pool.execute(`DROP TABLE IF EXISTS event_images`);
    await pool.execute(`
      CREATE TABLE event_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eventId INT NOT NULL,
        imagePath VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    console.log('Events schema updated successfully');
    
  } catch (error) {
    console.error('Error updating events schema:', error);
  } finally {
    process.exit(0);
  }
};

updateEventsSchema();