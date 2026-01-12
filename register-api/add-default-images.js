const { connectDB } = require('./mysql-config');

const addDefaultImages = async () => {
  const pool = await connectDB();
  
  try {
    // Update existing events with default poster images
    const defaultImages = ['event1.jpg', 'event2.jpg', 'event3.jpg', 'event4.jpg'];
    
    const [events] = await pool.execute('SELECT id FROM events ORDER BY id');
    
    for (let i = 0; i < events.length; i++) {
      const defaultImage = defaultImages[i % defaultImages.length];
      await pool.execute(
        'UPDATE events SET posterImage = ? WHERE id = ?',
        [defaultImage, events[i].id]
      );
    }

    console.log('Default poster images added to existing events');
    
  } catch (error) {
    console.error('Error adding default images:', error);
  } finally {
    process.exit(0);
  }
};

addDefaultImages();